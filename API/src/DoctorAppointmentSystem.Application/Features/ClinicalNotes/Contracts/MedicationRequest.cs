namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

public sealed record MedicationRequest(
    string Name,
    string Dosage,
    string Frequency,
    int? DurationInDays,
    string? Instructions
);
