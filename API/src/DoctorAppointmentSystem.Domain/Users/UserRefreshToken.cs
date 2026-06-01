namespace DoctorAppointmentSystem.Domain.Users;

public sealed class UserRefreshToken
{
    private UserRefreshToken()
    {
    }

    public UserRefreshToken(Guid userId, string tokenHash, DateTimeOffset expiresAt)
    {
        UserId = userId;
        TokenHash = tokenHash;
        ExpiresAt = expiresAt;
    }

    public Guid UserId { get; private set; }

    public string TokenHash { get; private set; } = string.Empty;

    public DateTimeOffset ExpiresAt { get; private set; }

    public DateTimeOffset? RevokedAt { get; private set; }

    public void Update(string tokenHash, DateTimeOffset expiresAt)
    {
        TokenHash = tokenHash;
        ExpiresAt = expiresAt;
        RevokedAt = null;
    }

    public void Revoke(DateTimeOffset utcNow)
    {
        RevokedAt = utcNow;
    }

    public bool IsActive(DateTimeOffset utcNow)
    {
        if (RevokedAt is not null)
        {
            return false;
        }

        if (ExpiresAt <= utcNow)
        {
            return false;
        }

        return true;
    }
}