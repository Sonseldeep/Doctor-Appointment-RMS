using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Users.GetCurrentUser;

public sealed record GetCurrentUserQuery(Guid UserId) : IQuery<CurrentUserResponse>;