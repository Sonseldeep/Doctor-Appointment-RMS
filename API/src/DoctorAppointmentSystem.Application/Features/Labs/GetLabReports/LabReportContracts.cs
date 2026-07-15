namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

public record LabReportResponse(
    Guid Id,
    string LabName,
    string PanelName,
    DateTime ObservationDateTime,
    List<LabReportDocumentResponse> Documents,
    List<ObservationResponse> Observations);

public record LabReportDocumentResponse(
    Guid Id,
    string DocumentUrl,
    string FileName,
    string DocumentType,
    string MimeType);

public record ObservationResponse(
    string TestName,
    string Value,
    string Unit,
    string ReferenceRange,
    bool IsAbnormal);