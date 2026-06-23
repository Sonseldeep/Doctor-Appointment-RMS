using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

// Remove 'ErrorOr' here. Your IQueryHandler interface adds it automatically.
public record GetLabReportsQuery(Guid PatientId) : IQuery<List<LabReportResponse>>;