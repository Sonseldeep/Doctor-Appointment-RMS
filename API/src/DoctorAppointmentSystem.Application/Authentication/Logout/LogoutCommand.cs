using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Authentication.Logout;

public sealed record LogoutCommand(Guid UserId) : ICommand;