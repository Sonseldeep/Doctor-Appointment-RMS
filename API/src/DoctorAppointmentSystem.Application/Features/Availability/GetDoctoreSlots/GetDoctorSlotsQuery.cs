using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Availability.Common;

namespace DoctorAppointmentSystem.Application.Features.Availability.GetDoctoreSlots;

public sealed record GetDoctorSlotsQuery(
    Guid DoctorUserId,
    DateOnly Date
) : IQuery<AvailabilityResponse>;