using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Users;

public class UserOtp : Entity
{
    private UserOtp()
    {
        
    }

    private UserOtp(
        Guid userId,
        string otpHash,
        DateTimeOffset expiresAt) : base(Guid.NewGuid())
    {
        UserId = userId;
        OtpHash = otpHash;
        ExpiresAt = expiresAt;
    }

    public Guid UserId { get; private  set; }
    public string OtpHash { get; private  set; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; private  set; }
    public DateTimeOffset? UsedAt { get; private set; }

    public static UserOtp Create(Guid userId, string otpHash, DateTimeOffset expiresAt)
    {
        return new UserOtp(userId, otpHash, expiresAt);
    }

    public bool IsValid(DateTimeOffset utcNow)
    {
        return UsedAt is null && ExpiresAt > utcNow;
    }

    public void MarkAsUsed(DateTimeOffset utcNow)
    {
        UsedAt = utcNow;
    }
}