using DoctorAppointmentSystem.Application.Features.Patients.Contracts;
using DoctorAppointmentSystem.Application.Features.Patients.GetPatientMe;
using DoctorAppointmentSystem.Application.Features.Patients.UpdatePatientProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/patients")]
[Authorize]
public sealed class PatientsController : ApiController
{
    private readonly ISender _sender;

    public PatientsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var result = await _sender.Send(new GetPatientMeQuery(userId), cancellationToken);
        return result.Match(Ok, Problem);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdatePatientProfileRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var cmd = new UpdatePatientProfileCommand(
            UserId: userId,
            PhoneNumber: request.PhoneNumber,
            Address: request.Address,
            Sex: request.Sex,
            DateOfBirth: request.DateOfBirth);

        var result = await _sender.Send(cmd, cancellationToken);
        return result.Match(_ => NoContent(), Problem);
    }
}