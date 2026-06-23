using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Labs;

public class LabReport : Entity
{
    //public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid PatientId { get; private set; }
    public string LabName { get; private set; } = string.Empty;
    public string PanelName { get; private set; } = string.Empty; // e.g., "Lipid Panel"
    public DateTime ObservationDateTime { get; private set; }
    public List<LabObservation> Observations { get; private set; } = new();

    private LabReport() { } // EF Core Required

    public static LabReport Create(Guid patientId, string labName, string panelName, DateTime observationDateTime)
    {
        return new LabReport
        {
            PatientId = patientId,
            LabName = labName,
            PanelName = panelName,
            ObservationDateTime = observationDateTime
        };
    }

    public void AddObservation(string testName, string value, string unit, string referenceRange, bool isAbnormal)
    {
        Observations.Add(new LabObservation(Id, testName, value, unit, referenceRange, isAbnormal));
    }
}