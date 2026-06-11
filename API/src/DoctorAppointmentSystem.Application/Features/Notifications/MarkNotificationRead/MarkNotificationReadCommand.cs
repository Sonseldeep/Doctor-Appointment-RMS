using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Notifications.MarkNotificationRead;

public sealed record MarkNotificationReadCommand(
    Guid UserId,
    Guid NotificationId) : ICommand;