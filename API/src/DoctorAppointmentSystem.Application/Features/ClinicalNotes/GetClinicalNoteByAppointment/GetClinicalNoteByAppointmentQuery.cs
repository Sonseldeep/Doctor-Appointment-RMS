using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetClinicalNoteByAppointment;

public sealed record GetClinicalNoteByAppointmentQuery(
    Guid UserId,
    Guid AppointmentId
) : IQuery<ClinicalNoteResponse>;