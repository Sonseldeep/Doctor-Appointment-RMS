namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IRefreshTokenStore
{
    Task StoreActiveAsync(Guid userId, string refreshToken, DateTimeOffset expiresAt, CancellationToken cancellationToken);

    Task<Guid?> GetUserIdIfValidAsync(string refreshToken, DateTimeOffset utcNow, CancellationToken cancellationToken);

    Task RevokeActiveAsync(Guid userId, DateTimeOffset utcNow, CancellationToken cancellationToken);
}