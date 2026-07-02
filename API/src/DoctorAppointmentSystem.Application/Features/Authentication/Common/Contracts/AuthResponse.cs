namespace DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

public sealed record AuthResponse(string AccessToken, bool MustChangePassword = false);