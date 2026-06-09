using DoctorAppointmentSystem.Application.Features.Admin.Doctor.ApproveDoctor;
using DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;
using DoctorAppointmentSystem.Application.Features.Admin.Doctor.SuspendDoctor;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/admin/doctors")]
[Authorize(Roles = "Admin")]
public sealed class AdminDoctorsController : ApiController
{
    private readonly ISender _sender;

    public AdminDoctorsController(ISender sender)
    {
        _sender = sender;
    }
    

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetAllDoctorsRequest request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(request.ToQuery(), cancellationToken);
        return result.Match(Ok, Problem);
    }
    [HttpPost("{doctorUserId:guid}/approve")]
    public async Task<IActionResult> Approve(Guid doctorUserId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new ApproveDoctorCommand(doctorUserId), cancellationToken);
        return result.Match(_ => NoContent(), Problem);
    }

    [HttpPost("{doctorUserId:guid}/suspend")]
    public async Task<IActionResult> Suspend(Guid doctorUserId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new SuspendDoctorCommand(doctorUserId), cancellationToken);
        return result.Match(_ => NoContent(), Problem);
    }
}