namespace DoctorAppointmentSystem.Application.Features.Availability.Common;

public sealed record SlotResponse(
    Guid SlotId,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool IsBooked);

public sealed record AvailabilityResponse(
    Guid AvailabilityId,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int SlotDurationMinutes,
    int TotalSlots,
    int BookedSlots,
    int FreeSlots,
    IReadOnlyList<SlotResponse> Slots);


public sealed record AvailabilitySummaryResponse(
    Guid AvailabilityId,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int SlotDurationMinutes,
    int TotalSlots,
    int BookedSlots,
    int FreeSlots);
