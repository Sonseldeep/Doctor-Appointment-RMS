using DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;
using DoctorAppointmentSystem.Application.Features.Notifications.MarkAllNotificationsRead;
using DoctorAppointmentSystem.Application.Features.Notifications.MarkNotificationRead;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/notifications")]
[Authorize]
public sealed class NotificationsController : ApiController
{
    private readonly ISender _sender;

    public NotificationsController(ISender sender)
    {
        _sender = sender;
    }

   
    [HttpGet]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new GetMyNotificationsQuery(userId), cancellationToken);

        return result.Match(Ok, Problem);
    }

  
    [HttpPut("{notificationId:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid notificationId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new MarkNotificationReadCommand(userId, notificationId),
            cancellationToken);

        return result.Match(_ => NoContent(), Problem);
    }


    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new MarkAllNotificationsReadCommand(userId),
            cancellationToken);

        return result.Match(_ => NoContent(), Problem);
    }
}
