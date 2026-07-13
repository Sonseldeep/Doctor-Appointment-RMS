using DoctorAppointmentSystem.Api.Common.Request;
using DoctorAppointmentSystem.Application.Features.Availability.CreateAvailability;
using DoctorAppointmentSystem.Application.Features.Availability.DeleteAvailability;
using DoctorAppointmentSystem.Application.Features.Availability.GetDoctoreSlots;
using DoctorAppointmentSystem.Application.Features.Availability.GetMyAvailability;
using DoctorAppointmentSystem.Application.Features.Availability.UpdateAvailability;
using DoctorAppointmentSystem.Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api")]
[Authorize]
public sealed class AvailabilityController : ApiController
{
    private readonly ISender _sender;

    public AvailabilityController(ISender sender)
    {
        _sender = sender;
    }


    [HttpPost("availability")]
    [Authorize(Roles = nameof(UserRole.Doctor))]
    public async Task<IActionResult> Create([FromBody] CreateAvailabilityRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }

        var command = new CreateAvailabilityCommand(doctorUserId, request.Date, request.StartTime, request.EndTime, request.SlotDurationMinutes);

        var result = await _sender.Send(command, cancellationToken);
        return result.Match(
            id => CreatedAtAction(nameof(GetMyAvailability), new { }, new { availabilityId = id }),
            Problem);
    }

   
    [HttpPut("availability/{availabilityId:guid}")]
    [Authorize(Roles = nameof(UserRole.Doctor))]
    public async Task<IActionResult> Update(Guid availabilityId, [FromBody] UpdateAvailabilityRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }

        var command = new UpdateAvailabilityCommand(doctorUserId, availabilityId, request.StartTime, request.EndTime, request.SlotDurationMinutes);

        var result = await _sender.Send(command, cancellationToken);
        return result.Match(_ => NoContent(), Problem);
    }

  
    [HttpDelete("availability/{availabilityId:guid}")]
    [Authorize(Roles = nameof(UserRole.Doctor))]
    public async Task<IActionResult> Delete(Guid availabilityId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new DeleteAvailabilityCommand(doctorUserId, availabilityId),
            cancellationToken);

        return result.Match(_ => NoContent(), Problem);
    }

   
    [HttpGet("availability/me")]
    [Authorize(Roles = nameof(UserRole.Doctor))]
    public async Task<IActionResult> GetMyAvailability(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new GetMyAvailabilityQuery(doctorUserId),
            cancellationToken);

        return result.Match(Ok, Problem);
    }


    [HttpGet("doctors/{doctorUserId:guid}/availability/{date}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDoctorSlots(
        Guid doctorUserId,
        DateOnly date,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetDoctorSlotsQuery(doctorUserId, date),
            cancellationToken);

        return result.Match(Ok, Problem);
    }
}



