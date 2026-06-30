namespace DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;

public static class GetMyNotificationsRequestExtensions
{
    public static GetMyNotificationsQuery ToQuery(this GetMyNotificationsRequest request, Guid userId) =>
        new(
            UserId: userId,
            Page: request.Page,
            PageSize: request.PageSize,
            IsRead: request.IsRead);
}