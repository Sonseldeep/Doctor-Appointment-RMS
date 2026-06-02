using DoctorAppointmentSystem.Application.Abstractions.Otp;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Otp;

internal sealed class OtpStore : IOtpStore
{
    private readonly ApplicationDbContext _dbContext;

    public OtpStore(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task InvalidateActiveAsync(
        Guid userId,
        OtpPurpose purpose,
        DateTimeOffset utcNow,
        CancellationToken cancellationToken)
    {
        var actives = await _dbContext.UserOtps
            .Where(x => x.UserId == userId
                        && x.Purpose == purpose
                        && x.UsedAt == null
                        && x.InvalidatedAt == null)
            .ToListAsync(cancellationToken);

        foreach (var otp in actives)
        {
            otp.Invalidate(utcNow);
        }
    }

    public async Task StoreAsync(
        Guid userId,
        OtpPurpose purpose,
        string otp,
        DateTimeOffset expiresAt,
        CancellationToken cancellationToken)
    {
        var utcNow = DateTimeOffset.UtcNow;
        var otpHash = OtpHash.Compute(otp);

        await InvalidateActiveAsync(userId, purpose, utcNow, cancellationToken);

        var entity = UserOtp.Create(userId, purpose, otpHash, expiresAt, utcNow);
        await _dbContext.UserOtps.AddAsync(entity, cancellationToken);
    }

    public async Task<bool> ValidateAndConsumeAsync(
        Guid userId,
        OtpPurpose purpose,
        string otp,
        DateTimeOffset utcNow,
        CancellationToken cancellationToken)
    {
        var otpHash = OtpHash.Compute(otp);

        var entity = await _dbContext.UserOtps
            .SingleOrDefaultAsync(
                x => x.UserId == userId
                     && x.Purpose == purpose
                     && x.OtpHash == otpHash
                     && x.InvalidatedAt == null,
                cancellationToken);

        if (entity is null || !entity.IsActive(utcNow))
        {
            return false;
        }

        entity.MarkAsUsed(utcNow);
        return true;
    }
}