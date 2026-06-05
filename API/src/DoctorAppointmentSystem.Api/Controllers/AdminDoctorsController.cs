using DoctorAppointmentSystem.Application.Features.Admin.Doctor.ApproveDoctor;
using DoctorAppointmentSystem.Application.Features.Admin.Doctor.SuspendDoctor;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/admin/doctors/{doctorUserId:guid}")]
[Authorize(Roles = "Admin")]
public sealed class AdminDoctorsController : ApiController
{
    private readonly ISender _sender;

    public AdminDoctorsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("approve")]
    public async Task<IActionResult> Approve(Guid doctorUserId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var adminUserId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new ApproveDoctorCommand(adminUserId, doctorUserId), cancellationToken);
        
        return result.Match(_ => NoContent(), Problem);
    }

    [HttpPost("suspend")]
    public async Task<IActionResult> Suspend(Guid doctorUserId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var adminUserId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new SuspendDoctorCommand(adminUserId, doctorUserId), cancellationToken);
        
        return result.Match(_ => NoContent(), Problem);
    }
}