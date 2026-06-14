using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.UpdateClinicalNote;

public sealed record UpdateClinicalNoteCommand(
    Guid DoctorUserId,
    Guid ClinicalNoteId,
    string Diagnosis,
    string? Observations,
    string? TreatmentSummary,
    DateTimeOffset? FollowUpDate,
    string? FollowUpInstructions,
    List<MedicationRequest>? Medications
) : ICommand<ClinicalNoteResponse>;