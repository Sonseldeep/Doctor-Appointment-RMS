using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Availability.UpdateAvailability;

public sealed record UpdateAvailabilityCommand(
    Guid DoctorUserId,
    Guid AvailabilityId,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int SlotDurationMinutes
) : ICommand;