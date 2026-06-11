using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;

internal sealed class GetMyNotificationsQueryHandler
    : IQueryHandler<GetMyNotificationsQuery, List<NotificationResponse>>
{
    private readonly INotificationRepository _notifications;

    public GetMyNotificationsQueryHandler(INotificationRepository notifications)
    {
        _notifications = notifications;
    }

    public async Task<ErrorOr<List<NotificationResponse>>> Handle(
        GetMyNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var notifications = await _notifications.GetByUserIdAsync(request.UserId, cancellationToken);

        var response = notifications
            .OrderByDescending(n => n.CreatedAtUtc)
            .Select(n => new NotificationResponse(
                n.Id,
                n.Title,
                n.Message,
                n.Type.ToString(),
                n.AppointmentId,
                n.IsRead,
                n.CreatedAtUtc))
            .ToList();

        return response;
    }
}