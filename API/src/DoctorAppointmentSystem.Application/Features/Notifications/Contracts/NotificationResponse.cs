namespace DoctorAppointmentSystem.Application.Features.Notifications.Contracts;

public sealed record NotificationResponse(
    Guid Id,
    string Title,
    string Message,
    string Type,
    Guid? AppointmentId,
    bool IsRead,
    DateTimeOffset CreatedAtUtc);
