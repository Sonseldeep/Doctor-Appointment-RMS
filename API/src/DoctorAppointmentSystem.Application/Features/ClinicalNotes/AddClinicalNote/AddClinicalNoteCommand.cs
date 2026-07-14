using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.AddClinicalNote;

public sealed record AddClinicalNoteCommand(
    Guid DoctorUserId,
    Guid AppointmentId,
    string Diagnosis,
    string? Observations,
    string? TreatmentSummary,
    Guid? FollowUpSlotId,
    string? FollowUpInstructions,
    List<MedicationRequest>? Medications
) : ICommand<ClinicalNoteResponse>;