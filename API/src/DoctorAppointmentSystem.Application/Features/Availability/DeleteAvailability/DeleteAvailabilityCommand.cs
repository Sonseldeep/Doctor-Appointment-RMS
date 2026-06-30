using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Availability.DeleteAvailability;


public sealed record DeleteAvailabilityCommand(
    Guid DoctorUserId,
    Guid AvailabilityId
) : ICommand;




