using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetUpcomingFollowUps;

public sealed record GetUpcomingFollowUpsQuery(Guid UserId) : IQuery<IReadOnlyList<ClinicalNoteResponse>>;