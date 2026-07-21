namespace DoctorAppointmentSystem.Application.Features.Labs.Common;

public record LabTechnicianSendHistoryItemResponse(
    Guid LabReportId,
    Guid PatientId,
    string PatientFirstName,
    string PatientLastName,
    string PatientEmail,
    string LabName,
    string PanelName,
    DateTime ObservationDateTime,
    DateTime SentAtUtc,
    int DocumentCount,
    int ObservationCount);