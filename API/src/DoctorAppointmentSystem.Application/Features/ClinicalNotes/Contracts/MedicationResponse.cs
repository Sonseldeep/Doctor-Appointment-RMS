namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;

public sealed record MedicationResponse(
    Guid Id,
    string Name,
    string Dosage,
    string Frequency,
    int? DurationInDays,
    string? Instructions
);
