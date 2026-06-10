using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Availability.Common;

namespace DoctorAppointmentSystem.Application.Features.Availability.GetMyAvailability;

public sealed record GetMyAvailabilityQuery(Guid DoctorUserId)
    : IQuery<IReadOnlyList<AvailabilitySummaryResponse>>;