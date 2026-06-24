//using DoctorAppointmentSystem.Domain.Abstractions;

//namespace DoctorAppointmentSystem.Domain.Labs;

//public class LabReport : Entity
//{
//    //public Guid Id { get; private set; } = Guid.NewGuid();
//    public Guid PatientId { get; private set; }
//    public string LabName { get; private set; } = string.Empty;
//    public string PanelName { get; private set; } = string.Empty; // e.g., "Lipid Panel"
//    public DateTime ObservationDateTime { get; private set; }
//    public List<LabObservation> Observations { get; private set; } = new();

//    private LabReport() { } // EF Core Required

//    public static LabReport Create(Guid patientId, string labName, string panelName, DateTime observationDateTime)
//    {
//        return new LabReport
//        {
//            PatientId = patientId,
//            LabName = labName,
//            PanelName = panelName,
//            ObservationDateTime = observationDateTime
//        };
//    }

//    public void AddObservation(string testName, string value, string unit, string referenceRange, bool isAbnormal)
//    {
//        Observations.Add(new LabObservation(Id, testName, value, unit, referenceRange, isAbnormal));
//    }
//}

using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Labs;

public class LabReport : Entity
{
    public Guid PatientId { get; private set; }
    public string LabName { get; private set; } = string.Empty;
    public string PanelName { get; private set; } = string.Empty;
    public DateTime ObservationDateTime { get; private set; }

    // New Hybrid Ingestion Properties
    public string? DocumentUrl { get; private set; }
    public string? DocumentType { get; private set; } // e.g., "PDF", "XRAY"
    public string? MimeType { get; private set; }     // e.g., "application/pdf", "image/jpeg"

    public List<LabObservation> Observations { get; private set; } = new();

    private LabReport() { } // EF Core Required

    public static LabReport Create(Guid patientId, string labName, string panelName, DateTime observationDateTime)
    {
        return new LabReport
        {
            Id = Guid.NewGuid(), // Now valid!
            PatientId = patientId,
            LabName = labName,
            PanelName = panelName,
            ObservationDateTime = observationDateTime
        };
    }

    public void AddObservation(string testName, string value, string unit, string referenceRange, bool isAbnormal)
    {
        // This will now pass a valid, non-empty Guid because Id was set in the Create method
        Observations.Add(new LabObservation(this.Id, testName, value, unit, referenceRange, isAbnormal));
    }

    // New Domain Behavior
    public void AttachDocument(string documentUrl, string documentType, string mimeType)
    {
        DocumentUrl = documentUrl;
        DocumentType = documentType;
        MimeType = mimeType;
    }
}