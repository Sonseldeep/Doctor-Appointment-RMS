using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.ClinicalNotes;

public sealed class ClinicalNote : Entity
{
    private readonly List<Medication> _medications = [];

    private ClinicalNote() { }

    private ClinicalNote(
        Guid appointmentId,
        Guid doctorUserId,
        Guid patientUserId,
        string diagnosis,
        string? observations,
        string? treatmentSummary,
        DateTimeOffset? followUpDate,
        string? followUpInstructions,
        DateTimeOffset createdAtUtc)
        : base(Guid.NewGuid())
    {
        AppointmentId = appointmentId;
        DoctorUserId = doctorUserId;
        PatientUserId = patientUserId;
        Diagnosis = diagnosis;
        Observations = observations;
        TreatmentSummary = treatmentSummary;
        FollowUpDate = followUpDate;
        FollowUpInstructions = followUpInstructions;
        CreatedAtUtc = createdAtUtc;
        UpdatedAtUtc = createdAtUtc;
    }

    public Guid AppointmentId { get; private set; }
    public Guid DoctorUserId { get; private set; }
    public Guid PatientUserId { get; private set; }

    public string Diagnosis { get; private set; } = string.Empty;

    public string? Observations { get; private set; }

    public string? TreatmentSummary { get; private set; }

    public DateTimeOffset? FollowUpDate { get; private set; }

    public string? FollowUpInstructions { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset UpdatedAtUtc { get; private set; }

    public IReadOnlyCollection<Medication> Medications => _medications.AsReadOnly();

    public static ClinicalNote Create(
        Guid appointmentId,
        Guid doctorUserId,
        Guid patientUserId,
        string diagnosis,
        string? observations,
        string? treatmentSummary,
        DateTimeOffset? followUpDate,
        string? followUpInstructions,
        DateTimeOffset utcNow)
        => new(
            appointmentId,
            doctorUserId,
            patientUserId,
            diagnosis,
            observations,
            treatmentSummary,
            followUpDate,
            followUpInstructions,
            utcNow);

    public void UpdateDetails(
        string diagnosis,
        string? observations,
        string? treatmentSummary,
        DateTimeOffset? followUpDate,
        string? followUpInstructions,
        DateTimeOffset utcNow)
    {
        Diagnosis = diagnosis;
        Observations = observations;
        TreatmentSummary = treatmentSummary;
        FollowUpDate = followUpDate;
        FollowUpInstructions = followUpInstructions;
        UpdatedAtUtc = utcNow;
    }

    public Medication AddMedication(
        string name,
        string dosage,
        string frequency,
        int? durationInDays,
        string? instructions)
    {
        var medication = Medication.Create(Id, name, dosage, frequency, durationInDays, instructions);
        _medications.Add(medication);
        return medication;
    }


    
    public void ClearMedications()
    {
        _medications.Clear();
    }

    public void Touch(DateTimeOffset utcNow)
    {
        UpdatedAtUtc = utcNow;
    }
}
