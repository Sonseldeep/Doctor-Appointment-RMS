namespace DoctorAppointmentSystem.Api.Common.Request;

public sealed record CreateAvailabilityRequest(
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int SlotDurationMinutes);
