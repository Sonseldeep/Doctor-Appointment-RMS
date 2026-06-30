using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;

internal sealed class GetMyNotificationsQueryHandler
    : IQueryHandler<GetMyNotificationsQuery, PagedResult<NotificationResponse>>
{
    private readonly INotificationRepository _notifications;

    public GetMyNotificationsQueryHandler(INotificationRepository notifications)
    {
        _notifications = notifications;
    }

    public async Task<ErrorOr<PagedResult<NotificationResponse>>> Handle(
        GetMyNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        return await _notifications.GetByUserIdPagedAsync(request, cancellationToken);
    }
}
