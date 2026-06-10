using DoctorAppointmentSystem.Application.Features.Doctors.Contract;
using DoctorAppointmentSystem.Application.Features.Doctors.CreateDoctorProfile;
using DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorByUserId;
using DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorMe;
using DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;
using DoctorAppointmentSystem.Application.Features.Doctors.UpdateDoctorProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/doctors")]
public sealed class DoctorsController : ApiController
{
    private readonly ISender _sender;

    public DoctorsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetDoctors([FromQuery] GetDoctorsRequest request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(request.ToQuery(), cancellationToken);
        return result.Match(Ok, Problem);
    }
    
    
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(new GetDoctorMeQuery(userId), cancellationToken);

        return result.Match(Ok, Problem);
    }
    
    
    [HttpGet("{userId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByUserId(Guid userId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetDoctorByUserIdQuery(userId), cancellationToken);

        return result.Match(Ok, Problem);
    }


    [HttpPost("profile")]
    [Authorize]
    public async Task<IActionResult> CreateProfile([FromBody] CreateDoctorProfileRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }
           

        var command = new CreateDoctorProfileCommand(userId,request.NmcNumber, request.Bio, request.Specialization, request.ConsultationFee);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            doctorProfileId => Ok(new { doctorProfileId }),
            Problem);
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateDoctorProfileRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }
          

        var command = new UpdateDoctorProfileCommand(userId, request.Bio, request.Specialization, request.ConsultationFee);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            _ => NoContent(),
            Problem);
    }
}