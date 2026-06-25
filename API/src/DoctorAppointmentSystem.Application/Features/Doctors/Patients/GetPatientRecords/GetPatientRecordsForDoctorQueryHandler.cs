using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Authentication; // For ICurrentUser
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using Microsoft.Extensions.Logging;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Patients.GetPatientRecords;

public record GetPatientRecordsForDoctorQuery(Guid PatientId) : IQuery<List<LabReportResponse>>;

public class GetPatientRecordsForDoctorQueryHandler : IQueryHandler<GetPatientRecordsForDoctorQuery, List<LabReportResponse>>
{
    private readonly ILabReportRepository _labRepository;
    private readonly ILogger<GetPatientRecordsForDoctorQueryHandler> _logger;

    public GetPatientRecordsForDoctorQueryHandler(
        ILabReportRepository labRepository,
        ILogger<GetPatientRecordsForDoctorQueryHandler> logger)
    {
        _labRepository = labRepository;
        _logger = logger;
    }

    public async Task<ErrorOr<List<LabReportResponse>>> Handle(GetPatientRecordsForDoctorQuery request, CancellationToken cancellationToken)
    {
        // 1. Fetch Reports
        var reports = await _labRepository.GetByPatientIdAsync(request.PatientId, cancellationToken);

        // 2. AUDIT LOGGING: In a real enterprise app, you'd write to an IAuditRepository here.
        // For now, we use structured logging which can be scraped by DataDog/Seq.
        _logger.LogInformation(
            "AUDIT: Medical records accessed. PatientId: {PatientId}. Action: {Action}. Timestamp: {Timestamp}",
            request.PatientId,
            "VIEW_LAB_REPORTS",
            DateTime.UtcNow);

        // 3. Map to the existing LabReportResponse used by the frontend
        return reports.Select(r => new LabReportResponse(
            r.Id,
            r.LabName,
            r.PanelName,
            r.ObservationDateTime,
            r.DocumentUrl,
            r.DocumentType,
            r.MimeType,
            r.Observations.Select(o => new ObservationResponse(
                o.TestName,
                o.Value,
                o.Unit,
                o.ReferenceRange,
                o.IsAbnormal)).ToList()
        )).ToList();
    }
}