namespace DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

public sealed record VerifyEmailRequest(string Email, string Otp);
