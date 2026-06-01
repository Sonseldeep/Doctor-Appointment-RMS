namespace DoctorAppointmentSystem.Application.Authentication.Common.Contracts;

public sealed record LoginRequest(string Email, string Password);