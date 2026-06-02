using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ResendOtp;

public sealed record ResendOtpCommand(string Email) : ICommand;