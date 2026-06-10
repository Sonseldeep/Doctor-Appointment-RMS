using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Availability.Common;
using DoctorAppointmentSystem.Domain.Availability;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Availability.GetDoctoreSlots;


internal sealed class GetDoctorSlotsQueryHandler
    : IQueryHandler<GetDoctorSlotsQuery, AvailabilityResponse>
{
    private readonly IDoctorAvailabilityRepository _availability;

    public GetDoctorSlotsQueryHandler(IDoctorAvailabilityRepository availability)
    {
        _availability = availability;
    }

    public async Task<ErrorOr<AvailabilityResponse>> Handle(
        GetDoctorSlotsQuery request,
        CancellationToken cancellationToken)
    {
        var availability = await _availability.GetByDoctorAndDateWithSlotsAsync(
            request.DoctorUserId, request.Date, cancellationToken);

        if (availability is null)
        {
            return AvailabilityErrors.NotFound;
        }

        var slots = availability.Slots
            .OrderBy(s => s.StartTime)
            .Select(s => new SlotResponse(
                SlotId: s.Id,
                StartTime: s.StartTime,
                EndTime: s.EndTime,
                IsBooked: s.IsBooked))
            .ToList()
            .AsReadOnly();

        return new AvailabilityResponse(
            AvailabilityId: availability.Id,
            Date: availability.Date,
            StartTime: availability.StartTime,
            EndTime: availability.EndTime,
            SlotDurationMinutes: availability.SlotDurationMinutes,
            TotalSlots: slots.Count,
            BookedSlots: slots.Count(s => s.IsBooked),
            FreeSlots: slots.Count(s => !s.IsBooked),
            Slots: slots);
    }
}
