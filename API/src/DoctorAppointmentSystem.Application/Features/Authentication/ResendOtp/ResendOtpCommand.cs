using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Authentication.ResendOtp;

public sealed record ResendOtpCommand(string Email) : ICommand;