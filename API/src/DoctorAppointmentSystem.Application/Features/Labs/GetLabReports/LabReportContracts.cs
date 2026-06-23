namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

public record LabReportResponse(
    Guid Id,
    string LabName,
    string PanelName,
    DateTime ObservationDate,
    List<ObservationResponse> Observations);

public record ObservationResponse(
    string TestName,
    string Value,
    string Unit,
    string ReferenceRange,
    bool IsAbnormal);