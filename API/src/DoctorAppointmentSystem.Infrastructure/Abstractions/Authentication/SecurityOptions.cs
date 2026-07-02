namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

public sealed class SecurityOptions
{
    public const string SectionName = "Security";

    public int MaxFailedLoginAttempts { get; init; }
    public int LockoutDurationHours { get; init; } 
    public int PasswordExpiryDays { get; init; }
}