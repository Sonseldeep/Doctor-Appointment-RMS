namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IDateTimeProvider
{
    DateTimeOffset UtcNow { get; }
}