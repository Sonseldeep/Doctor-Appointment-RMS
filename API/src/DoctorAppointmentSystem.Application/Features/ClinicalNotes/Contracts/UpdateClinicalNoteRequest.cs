namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

public sealed record UpdateClinicalNoteRequest(
    string Diagnosis,
    string? Observations,
    string? TreatmentSummary,
    DateTimeOffset? FollowUpDate,
    string? FollowUpInstructions,
    List<MedicationRequest>? Medications
);
