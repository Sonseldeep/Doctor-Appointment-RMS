using DoctorAppointmentSystem.Domain.Notifications;

namespace DoctorAppointmentSystem.Application.Abstractions.Notifications;

public interface INotificationRepository
{
    Task AddAsync(Notification notification, CancellationToken cancellationToken = default);

    Task<List<Notification>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<Notification?> GetByIdAsync(Guid notificationId, CancellationToken cancellationToken = default);

    Task<int> MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
}
