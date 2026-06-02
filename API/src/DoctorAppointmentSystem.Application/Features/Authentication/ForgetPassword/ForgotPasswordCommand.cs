using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ForgetPassword;

public sealed record ForgotPasswordCommand(string Email) : ICommand;