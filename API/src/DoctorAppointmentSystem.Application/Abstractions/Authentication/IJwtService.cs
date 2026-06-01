using ErrorOr;

namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IJwtService
{
    Task<ErrorOr<TokenResponse>> GetAccessTokenAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task<ErrorOr<TokenResponse>> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default);
}