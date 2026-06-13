using DoctorAppointmentSystem.Domain.ClinicalNotes;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;


public sealed record ClinicalNoteWithDetailsDto(
    Guid Id,
    Guid AppointmentId,
    Guid DoctorUserId,
    Guid PatientUserId,
    string Diagnosis,
    string? Observations,
    string? TreatmentSummary,
    DateTimeOffset? FollowUpDate,
    string? FollowUpInstructions,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc,
    DateTimeOffset AppointmentStartUtc,
    string DoctorFirstName,
    string DoctorLastName,
    string? DoctorPhotoUrl,
    string PatientFirstName,
    string PatientLastName,
    string? PatientPhotoUrl,
    IReadOnlyCollection<Medication> Medications
);
