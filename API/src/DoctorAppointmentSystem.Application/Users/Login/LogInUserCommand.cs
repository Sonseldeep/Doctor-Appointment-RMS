using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Users.Login;

public sealed record LogInUserCommand(string Email, string Password)
    : ICommand<AccessTokenResponse>;