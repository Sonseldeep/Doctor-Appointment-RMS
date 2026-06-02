using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Users;

public sealed class UserOtp : Entity
{
    private UserOtp()
    {
    }

    private UserOtp(
        Guid userId,
        OtpPurpose purpose,
        string otpHash,
        DateTimeOffset expiresAt,
        DateTimeOffset createdAt) : base(Guid.NewGuid())
    {
        UserId = userId;
        Purpose = purpose;
        OtpHash = otpHash;
        ExpiresAt = expiresAt;
        CreatedAt = createdAt;
        FailedAttempts = 0;
    }

    public Guid UserId { get; private set; }

    public OtpPurpose Purpose { get; private set; }

    public string OtpHash { get; private set; } = string.Empty;

    public DateTimeOffset ExpiresAt { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? UsedAt { get; private set; }

    public DateTimeOffset? InvalidatedAt { get; private set; }

    public int FailedAttempts { get; private set; }

    public static UserOtp Create(Guid userId, OtpPurpose purpose, string otpHash, DateTimeOffset expiresAt, DateTimeOffset createdAt)
    {
        return new UserOtp(userId, purpose, otpHash, expiresAt, createdAt);
    }

    public bool IsActive(DateTimeOffset utcNow)
    {
        return UsedAt is null
               && InvalidatedAt is null
               && ExpiresAt > utcNow;
    }

    public void MarkAsUsed(DateTimeOffset utcNow)
    {
        UsedAt = utcNow;
    }

    public void Invalidate(DateTimeOffset utcNow)
    {
        InvalidatedAt = utcNow;
    }

    public void IncrementFailedAttempt()
    {
        FailedAttempts++;
    }
}