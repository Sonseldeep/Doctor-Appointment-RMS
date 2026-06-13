using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetMyClinicalNotes;

public sealed record GetMyClinicalNotesQuery(
    Guid UserId
) : IQuery<IReadOnlyList<ClinicalNoteResponse>>;