using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Labs;

public class LabReport : Entity
{
    public Guid PatientId { get; private set; }
    public string LabName { get; private set; } = string.Empty;
    public string PanelName { get; private set; } = string.Empty;
    public DateTime ObservationDateTime { get; private set; }

    public string? DocumentUrl { get; private set; }
    public string? DocumentType { get; private set; } 
    public string? MimeType { get; private set; }     

    public List<LabObservation> Observations { get; private set; } = new();

    private LabReport() { }

    public static LabReport Create(Guid patientId, string labName, string panelName, DateTime observationDateTime)
    {
        return new LabReport
        {
            Id = Guid.NewGuid(), 
            PatientId = patientId,
            LabName = labName,
            PanelName = panelName,
            ObservationDateTime = observationDateTime
        };
    }

    public void AddObservation(string testName, string value, string unit, string referenceRange, bool isAbnormal)
    {
        Observations.Add(new LabObservation(this.Id, testName, value, unit, referenceRange, isAbnormal));
    }

    public void AttachDocument(string documentUrl, string documentType, string mimeType)
    {
        DocumentUrl = documentUrl;
        DocumentType = documentType;
        MimeType = mimeType;
    }
}