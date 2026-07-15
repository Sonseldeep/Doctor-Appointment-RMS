using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Availability.Common;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Availability.GetMyAvailability;

internal sealed class GetMyAvailabilityQueryHandler
    : IQueryHandler<GetMyAvailabilityQuery, IReadOnlyList<AvailabilitySummaryResponse>>
{
    private readonly IDoctorAvailabilityRepository _availability;

    public GetMyAvailabilityQueryHandler(IDoctorAvailabilityRepository availability)
    {
        _availability = availability;
    }

    public async Task<ErrorOr<IReadOnlyList<AvailabilitySummaryResponse>>> Handle(
        GetMyAvailabilityQuery request,
        CancellationToken cancellationToken)
    {
        var list = await _availability.GetByDoctorAsync(request.DoctorUserId, cancellationToken);

        var result = list.Select(a => new AvailabilitySummaryResponse(
                AvailabilityId: a.Id,
                Date: a.Date,
                StartTime: a.StartTime,
                EndTime: a.EndTime,
                SlotDurationMinutes: a.SlotDurationMinutes,
                TotalSlots: a.Slots.Count,
                BookedSlots: a.Slots.Count(s => s.IsBooked),
                FreeSlots: a.Slots.Count(s => !s.IsBooked)))
            .ToList()
            .AsReadOnly();

        return (ErrorOr<IReadOnlyList<AvailabilitySummaryResponse>>)result;
    }
}