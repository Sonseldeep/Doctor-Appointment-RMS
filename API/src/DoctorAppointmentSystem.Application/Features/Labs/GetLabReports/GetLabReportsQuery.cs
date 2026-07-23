using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;


public record GetLabReportsQuery(Guid PatientId)
    : IQuery<List<LabReportResponse>>;