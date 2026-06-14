namespace DoctorAppointmentSystem.Api.Common.Request;

public sealed record UpdateAvailabilityRequest(
    TimeOnly StartTime,
    TimeOnly EndTime,
    int SlotDurationMinutes);
