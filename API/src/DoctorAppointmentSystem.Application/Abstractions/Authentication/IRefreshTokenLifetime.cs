namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IRefreshTokenLifetime
{
    TimeSpan Duration { get; }
}