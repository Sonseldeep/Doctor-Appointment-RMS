namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

public sealed record ClinicalNoteResponse(
    Guid Id,
    Guid AppointmentId,
    Guid DoctorUserId,
    Guid PatientUserId,
    string DoctorName,
    string? DoctorPhotoUrl,
    string PatientName,
    string? PatientPhotoUrl,
    DateTimeOffset AppointmentDate,
    string Diagnosis,
    string? Observations,
    string? TreatmentSummary,
    DateTimeOffset? FollowUpDate,
    string? FollowUpInstructions,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc,
    List<MedicationResponse> Medications
);
