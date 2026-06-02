using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ResetPassword;

public sealed record ResetPasswordCommand(
    string Email,
    string Otp,
    string NewPassword) : ICommand;