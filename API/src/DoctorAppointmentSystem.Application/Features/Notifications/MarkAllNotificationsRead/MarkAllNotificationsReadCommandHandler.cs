using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Notifications.MarkAllNotificationsRead;

internal sealed class MarkAllNotificationsReadCommandHandler
    : ICommandHandler<MarkAllNotificationsReadCommand>
{
    private readonly INotificationRepository _notifications;

    public MarkAllNotificationsReadCommandHandler(INotificationRepository notifications)
    {
        _notifications = notifications;
    }

    public async Task<ErrorOr<Success>> Handle(
        MarkAllNotificationsReadCommand request,
        CancellationToken cancellationToken)
    {
        await _notifications.MarkAllAsReadAsync(request.UserId, cancellationToken);

        return Result.Success;
    }
}