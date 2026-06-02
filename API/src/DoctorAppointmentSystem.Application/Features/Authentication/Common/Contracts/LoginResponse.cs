namespace DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

public sealed record LoginResponse(
    Guid UserId,
    string AccessToken,
    string RefreshToken);