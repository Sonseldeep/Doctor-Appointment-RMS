namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

public sealed class SecurityOptions
{
    public const string SectionName = "Security";

    public int MaxFailedLoginAttempts { get; init; } = 5;
    public int LockoutDurationHours { get; init; } = 24;
    public int PasswordExpiryDays { get; init; } = 60;
}