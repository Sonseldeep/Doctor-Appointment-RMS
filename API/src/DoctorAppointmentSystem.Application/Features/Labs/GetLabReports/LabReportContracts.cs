namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

public record LabReportResponse(
    Guid Id,
    string LabName,
    string PanelName,
    DateTime ObservationDateTime,
    string? DocumentUrl,
    string? DocumentType,
    string? MimeType,
    List<ObservationResponse> Observations);

public record ObservationResponse(
    string TestName,
    string Value,
    string Unit,
    string ReferenceRange,
    bool IsAbnormal);