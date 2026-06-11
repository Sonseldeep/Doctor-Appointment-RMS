using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;

public sealed record GetMyNotificationsQuery(Guid UserId) : IQuery<List<NotificationResponse>>;