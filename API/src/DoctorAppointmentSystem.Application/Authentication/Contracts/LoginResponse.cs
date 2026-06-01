namespace DoctorAppointmentSystem.Application.Authentication.Contracts;

public sealed record LoginResponse(
    Guid UserId,
    string AccessToken,
    string RefreshToken);