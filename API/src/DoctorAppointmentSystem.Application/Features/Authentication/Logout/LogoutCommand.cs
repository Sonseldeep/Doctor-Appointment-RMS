using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Authentication.Logout;

public sealed record LogoutCommand(Guid UserId) : ICommand;