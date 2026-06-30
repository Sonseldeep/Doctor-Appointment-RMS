using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;

public sealed record GetMyNotificationsQuery(
    Guid UserId,
    int Page,
    int PageSize,
    bool? IsRead) 
    : IQuery<PagedResult<NotificationResponse>>;