namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public sealed record TokenResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    int RefreshExpiresIn);