namespace DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;

public sealed record GetMyNotificationsRequest(
    int Page = 1,
    int PageSize = 10,
    bool? IsRead = null);