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

    public async Task StoreAsync(
        Guid userId,
        string otp,
        DateTimeOffset expiresAt,
        CancellationToken cancellationToken)
    {
        var otpHash = OtpHash.Compute(otp);

        var existing = await _dbContext
            .UserOtps
            .Where(x => x.UserId == userId && x.UsedAt == null)
            .ToListAsync(cancellationToken);

        _dbContext.UserOtps.RemoveRange(existing);

        var entity = UserOtp.Create(userId, otpHash, expiresAt);
        await _dbContext.UserOtps.AddAsync(entity, cancellationToken);
    }

    public async Task<bool> ValidateAndConsumeAsync(
        Guid userId,
        string otp,
        DateTimeOffset utcNow,
        CancellationToken cancellationToken)
    {
        var otpHash = OtpHash.Compute(otp);

        var entity = await _dbContext
            .UserOtps
            .SingleOrDefaultAsync(
                x => x.UserId == userId && x.OtpHash == otpHash,
                cancellationToken);

        if (entity is null || !entity.IsValid(utcNow))
        {
            return false;
        }

        entity.MarkAsUsed(utcNow);
        return true;
    }
}