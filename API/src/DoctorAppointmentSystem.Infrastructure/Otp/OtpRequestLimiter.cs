using DoctorAppointmentSystem.Application.Abstractions.Otp;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using ErrorOr;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Otp;

internal sealed class OtpRequestLimiter : IOtpRequestLimiter
{
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(10);

    private const int ResendLimit = 3; 
    private const int ForgotLimit = 3; 

    private readonly ApplicationDbContext _dbContext;

    public OtpRequestLimiter(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Success>> CheckAndIncrementAsync(
        string email,
        OtpPurpose purpose,
        DateTimeOffset utcNow,
        CancellationToken cancellationToken)
    {
        email = email.Trim().ToLowerInvariant();

        var entity = await _dbContext.OtpRequestLimits
            .SingleOrDefaultAsync(x => x.Email == email && x.Purpose == purpose, cancellationToken);

        if (entity is null)
        {
            entity = OtpRequestLimit.Create(email, purpose, utcNow);
            entity.Increment();
            await _dbContext.OtpRequestLimits.AddAsync(entity, cancellationToken);
            return Result.Success;
        }

        if (!entity.IsInWindow(utcNow, Window))
        {
            entity.ResetWindow(utcNow);
        }

        var limit = purpose switch
        {
            OtpPurpose.EmailVerification => ResendLimit,
            OtpPurpose.PasswordReset => ForgotLimit,
            _ => 3
        };

        if (entity.RequestCount >= limit)
        {
            return OtpRateLimitErrors.TooManyRequests;
        }

        entity.Increment();
        return Result.Success;
    }
}