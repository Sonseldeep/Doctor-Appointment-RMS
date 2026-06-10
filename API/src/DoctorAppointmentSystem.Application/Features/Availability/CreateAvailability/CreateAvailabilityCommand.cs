using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Availability.CreateAvailability;

public sealed record CreateAvailabilityCommand(
    Guid DoctorUserId,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int SlotDurationMinutes
) : ICommand<Guid>;