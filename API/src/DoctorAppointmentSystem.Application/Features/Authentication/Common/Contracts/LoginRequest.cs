namespace DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

public sealed record LoginRequest(string Email, string Password);