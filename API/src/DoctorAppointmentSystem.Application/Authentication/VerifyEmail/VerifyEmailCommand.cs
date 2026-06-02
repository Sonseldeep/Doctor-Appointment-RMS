using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Authentication.VerifyEmail;

public record VerifyEmailCommand(string Email, string Otp) : ICommand;
