namespace DoctorAppointmentSystem.Domain.Labs;


public class LabReportDocument
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid LabReportId { get; private set; }

    public LabReport LabReport { get; private set; } = null!;

    public string DocumentUrl { get; private set; } = string.Empty;
    public string FileName { get; private set; } = string.Empty;
    public string DocumentType { get; private set; } = string.Empty; // "XRAY" | "PDF" | "IMAGE"
    public string MimeType { get; private set; } = string.Empty;
    public int SortOrder { get; private set; }
    public DateTime UploadedAtUtc { get; private set; }

    private LabReportDocument() { }

    public LabReportDocument(
        Guid labReportId,
        string documentUrl,
        string fileName,
        string documentType,
        string mimeType,
        int sortOrder,
        DateTime uploadedAtUtc)
    {
        Id = Guid.NewGuid();
        LabReportId = labReportId;
        DocumentUrl = documentUrl;
        FileName = fileName;
        DocumentType = documentType;
        MimeType = mimeType;
        SortOrder = sortOrder;
        UploadedAtUtc = uploadedAtUtc;
    }

    public bool IsImage => MimeType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
}