namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IAccountLockoutOptions
{
    int MaxFailedAttempts { get; }
    
    TimeSpan LockoutDuration { get; }
}