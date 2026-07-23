using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Common;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetUpcomingFollowUp;

internal sealed class GetUpcomingFollowUpsQueryHandler
    : IQueryHandler<GetUpcomingFollowUpsQuery, IReadOnlyList<ClinicalNoteResponse>>
{
    private readonly IClinicalNoteRepository _clinicalNotes;

    public GetUpcomingFollowUpsQueryHandler(IClinicalNoteRepository clinicalNotes)
    {
        _clinicalNotes = clinicalNotes;
    }

    public async Task<ErrorOr<IReadOnlyList<ClinicalNoteResponse>>> Handle(GetUpcomingFollowUpsQuery request, CancellationToken cancellationToken)
    {
        // Get current time to filter upcoming
        var now = DateTimeOffset.UtcNow;

        var notes = await _clinicalNotes.GetUpcomingFollowUpsAsync(request.UserId, now, cancellationToken);

        return notes.Select(ClinicalNoteMapper.ToResponse).ToList().AsReadOnly();
    }
}