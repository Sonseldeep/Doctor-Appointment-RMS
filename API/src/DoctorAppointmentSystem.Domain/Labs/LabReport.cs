using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Labs;

public class LabReport : Entity
{
    public Guid PatientId { get; private set; }
    public string LabName { get; private set; } = string.Empty;
    public string PanelName { get; private set; } = string.Empty;
    public DateTime ObservationDateTime { get; private set; }

    public List<LabObservation> Observations { get; private set; } = [];
    public List<LabReportDocument> Documents { get; private set; } = [];

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

   
    public void AddDocument(string documentUrl, string fileName, string documentType, string mimeType, DateTime uploadedAtUtc)
    {
        Documents.Add(new LabReportDocument(
            this.Id,
            documentUrl,
            fileName,
            documentType,
            mimeType,
            sortOrder: Documents.Count,
            uploadedAtUtc));
    }
}