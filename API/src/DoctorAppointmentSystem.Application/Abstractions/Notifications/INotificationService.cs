using DoctorAppointmentSystem.Domain.Notifications;

namespace DoctorAppointmentSystem.Application.Abstractions.Notifications;

public interface INotificationService
{
    Task SendToUserAsync(Guid userId, Notification notification, CancellationToken cancellationToken = default);
}
