using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;
using DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;
using DoctorAppointmentSystem.Domain.Notifications;

namespace DoctorAppointmentSystem.Application.Abstractions.Notifications;

public interface INotificationRepository
{
    Task AddAsync(Notification notification, CancellationToken cancellationToken = default);

    Task<List<Notification>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    
    
    Task<PagedResult<NotificationResponse>> GetByUserIdPagedAsync(
        GetMyNotificationsQuery query,
        CancellationToken cancellationToken = default);

    Task<Notification?> GetByIdAsync(Guid notificationId, CancellationToken cancellationToken = default);

    Task<int> MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
}
