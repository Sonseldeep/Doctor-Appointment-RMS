using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;


public record GetLabReportsQuery(Guid PatientId) : IQuery<List<LabReportResponse>>;