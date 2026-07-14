namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;


public sealed record AddClinicalNoteRequest(
    Guid AppointmentId,
    string Diagnosis,
    string? Observations,
    string? TreatmentSummary,
    Guid? FollowUpSlotId,
    string? FollowUpInstructions,
    List<MedicationRequest>? Medications
);
