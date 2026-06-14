using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.ClinicalNotes;

public sealed class Medication : Entity
{
    private Medication() { }

    private Medication(
        Guid clinicalNoteId,
        string name,
        string dosage,
        string frequency,
        int? durationInDays,
        string? instructions)
        : base(Guid.NewGuid())
    {
        ClinicalNoteId = clinicalNoteId;
        Name = name;
        Dosage = dosage;
        Frequency = frequency;
        DurationInDays = durationInDays;
        Instructions = instructions;
    }

    public Guid ClinicalNoteId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string Dosage { get; private set; } = string.Empty;

    public string Frequency { get; private set; } = string.Empty;

    public int? DurationInDays { get; private set; }

    public string? Instructions { get; private set; }

    public static Medication Create(
        Guid clinicalNoteId,
        string name,
        string dosage,
        string frequency,
        int? durationInDays,
        string? instructions)
        => new(clinicalNoteId, name, dosage, frequency, durationInDays, instructions);

    public void Update(
        string name,
        string dosage,
        string frequency,
        int? durationInDays,
        string? instructions)
    {
        Name = name;
        Dosage = dosage;
        Frequency = frequency;
        DurationInDays = durationInDays;
        Instructions = instructions;
    }
    
    
}