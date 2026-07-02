using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Notifications.MarkNotificationRead;

internal sealed class MarkNotificationReadCommandHandler
    : ICommandHandler<MarkNotificationReadCommand>
{
    private readonly INotificationRepository _notifications;
    private readonly IUnitOfWork _uow;

    public MarkNotificationReadCommandHandler(
        INotificationRepository notifications,
        IUnitOfWork uow)
    {
        _notifications = notifications;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(
        MarkNotificationReadCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await _notifications.GetByIdAsync(request.NotificationId, cancellationToken);

        if (notification is null)
        {
            return Error.NotFound("Notification.NotFound", "Notification was not found.");
        }

        if (notification.UserId != request.UserId)
        {
            return Error.Forbidden("Notification.Forbidden", "You do not own this notification.");
        }

        notification.MarkAsRead();

        await _uow.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }
}