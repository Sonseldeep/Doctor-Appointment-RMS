using DoctorAppointmentSystem.Application.Abstractions.Authentication;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}