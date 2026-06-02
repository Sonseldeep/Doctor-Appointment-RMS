namespace DoctorAppointmentSystem.Application.Authentication.Common.Contracts;

public sealed record VerifyEmailRequest(string Email, string Otp);
