using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal sealed class RefreshTokenStore : IRefreshTokenStore
{
    private readonly ApplicationDbContext _dbContext;

    public RefreshTokenStore(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task StoreActiveAsync(
        Guid userId,
        string refreshToken,
        DateTimeOffset expiresAt,
        CancellationToken cancellationToken)
    {
        var tokenHash = RefreshTokenHash.Compute(refreshToken);

        var existing = await _dbContext
            .UserRefreshTokens
            .SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (existing is null)
        {
            var entity = UserRefreshToken.Create(userId, refreshToken, expiresAt);
            await _dbContext.UserRefreshTokens.AddAsync(entity, cancellationToken);
            return;
        }

        existing.Update(tokenHash, expiresAt);
    }

    public async Task<Guid?> GetUserIdIfValidAsync(string refreshToken, DateTimeOffset utcNow, CancellationToken cancellationToken)
    {
        var tokenHash = RefreshTokenHash.Compute(refreshToken);

        var existing = await _dbContext
            .UserRefreshTokens
            .SingleOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);

        if (existing is null)
        {
            return null;
        }

        var isActive = existing.IsActive(utcNow);
        if (!isActive)
        {
            return null;
        }

        return existing.UserId;
    }

    public async Task RevokeActiveAsync(Guid userId, DateTimeOffset utcNow, CancellationToken cancellationToken)
    {
        var existing = await _dbContext
            .UserRefreshTokens
            .SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        existing?.Revoke(utcNow);
    }
}