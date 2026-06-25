using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Labs.ExportLabReport;

public record ExportLabReportQuery(Guid LabReportId) : IQuery<byte[]>;