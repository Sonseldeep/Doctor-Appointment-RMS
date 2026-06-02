using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Users;

public sealed class OtpRequestLimit : Entity
{
    private OtpRequestLimit() { }

    private OtpRequestLimit(
        string email,
        OtpPurpose purpose,
        DateTimeOffset windowStartUtc,
        int requestCount) : base(Guid.NewGuid())
    {
        Email = email;
        Purpose = purpose;
        WindowStartUtc = windowStartUtc;
        RequestCount = requestCount;
    }

    public string Email { get; private set; } = string.Empty;
    public OtpPurpose Purpose { get; private set; }
    public DateTimeOffset WindowStartUtc { get; private set; }
    public int RequestCount { get; private set; }

    public static OtpRequestLimit Create(string email, OtpPurpose purpose, DateTimeOffset windowStartUtc)
        => new(email, purpose, windowStartUtc, 0);

    public bool IsInWindow(DateTimeOffset utcNow, TimeSpan window)
        => WindowStartUtc.Add(window) > utcNow;

    public void ResetWindow(DateTimeOffset newWindowStartUtc)
    {
        WindowStartUtc = newWindowStartUtc;
        RequestCount = 0;
    }

    public void Increment() => RequestCount++;
}