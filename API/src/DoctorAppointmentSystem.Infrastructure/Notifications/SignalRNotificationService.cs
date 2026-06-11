using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DoctorAppointmentSystem.Infrastructure.Notifications;

internal sealed class SignalRNotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendToUserAsync(
        Guid userId,
        Notification notification,
        CancellationToken cancellationToken = default)
    {
        var groupName = NotificationHub.GetGroupName(userId.ToString());

        var payload = new NotificationResponse(
            notification.Id,
            notification.Title,
            notification.Message,
            notification.Type.ToString(),
            notification.AppointmentId,
            notification.IsRead,
            notification.CreatedAtUtc);

        await _hubContext.Clients
            .Group(groupName)
            .SendAsync("ReceiveNotification", payload, cancellationToken);
    }
}