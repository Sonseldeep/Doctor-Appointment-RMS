using DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;
using DoctorAppointmentSystem.Application.Features.Appointments.CancelAppointment;
using DoctorAppointmentSystem.Application.Features.Appointments.CompleteAppointment;
using DoctorAppointmentSystem.Application.Features.Appointments.ConfirmAppointment;
using DoctorAppointmentSystem.Application.Features.Appointments.Contracts;
using DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/appointments")]
[Authorize]
public sealed class AppointmentsController : ApiController
{
    private readonly ISender _sender;

    public AppointmentsController(ISender sender)
    {
        _sender = sender;
    }


    [HttpGet("me")]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }
            

        var result = await _sender.Send(new GetMyAppointmentsQuery(userId), cancellationToken);

        return result.Match(Ok, Problem);
    }

    [HttpPost]
    public async Task<IActionResult> Book(
        [FromBody] BookAppointmentRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var patientUserId))
        {
            return Unauthorized();
        }
            

        var command = new BookAppointmentCommand(
            PatientUserId: patientUserId,
            DoctorUserId: request.DoctorUserId,
            StartUtc: request.StartUtc,
            EndUtc: request.EndUtc,
            Notes: request.Notes);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            appointmentId => Ok(new { appointmentId }),
            Problem);
    }

    [HttpPost("{appointmentId:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid appointmentId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }
            

        var result = await _sender.Send(
            new ConfirmAppointmentCommand(doctorUserId, appointmentId),
            cancellationToken);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpPost("{appointmentId:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid appointmentId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var patientUserId))
        {
            return Unauthorized();
        }
          

        var result = await _sender.Send(
            new CancelAppointmentCommand(patientUserId, appointmentId),
            cancellationToken);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpPost("{appointmentId:guid}/complete")]
    public async Task<IActionResult> Complete(Guid appointmentId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }
            

        var result = await _sender.Send(
            new CompleteAppointmentCommand(doctorUserId, appointmentId),
            cancellationToken);

        return result.Match(
            _ => NoContent(),
            Problem);
    }
}