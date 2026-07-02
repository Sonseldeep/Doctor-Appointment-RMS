
using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using Microsoft.Extensions.Logging;
using ErrorOr;
using DoctorAppointmentSystem.Domain.Labs;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Patients.GetPatientRecords;

public record GetPatientRecordsForDoctorQuery(Guid PatientId) : IQuery<List<LabReportResponse>>;

public class GetPatientRecordsForDoctorQueryHandler : IQueryHandler<GetPatientRecordsForDoctorQuery, List<LabReportResponse>>
{
    private readonly ILabReportRepository _labRepository;
    private readonly IMedicalRecordAccessLogRepository _auditRepository;
    private readonly IUserContext _userContext;
    private readonly ILogger<GetPatientRecordsForDoctorQueryHandler> _logger;
    private readonly IAppointmentRepository _appointmentRepository;

    public GetPatientRecordsForDoctorQueryHandler(
        ILabReportRepository labRepository,
        IMedicalRecordAccessLogRepository auditRepository,
        IUserContext userContext,
        ILogger<GetPatientRecordsForDoctorQueryHandler> logger,
        IAppointmentRepository labAppointmentRepository,
        IAppointmentRepository appointmentRepository)
    {
        _labRepository = labRepository;
        _auditRepository = auditRepository;
        _userContext = userContext;
        _logger = logger;
        _appointmentRepository = appointmentRepository;
    }

    public async Task<ErrorOr<List<LabReportResponse>>> Handle(GetPatientRecordsForDoctorQuery request, CancellationToken cancellationToken)
    {
        var isAssociated = await _appointmentRepository.HasAssociationAsync(_userContext.UserId, request.PatientId, cancellationToken);
        
        if (!isAssociated)
        {
            _logger.LogWarning("SECURITY: Doctor {DoctorId} attempted to access lab reports for unassociated PatientId: {PatientId}", _userContext.UserId, request.PatientId);

            return MedicalRecordErrors.NotAssociatedWithPatient;
        }

     
        var reports = await _labRepository.GetByPatientIdAsync(request.PatientId, cancellationToken);

        var auditLog = new MedicalRecordAccessLog(
            Guid.NewGuid(),
            _userContext.UserId,
            request.PatientId,
            "VIEW_LAB_REPORTS",
            _userContext.IpAddress,
            DateTime.UtcNow
        );

        try
        {
            await _auditRepository.AddAsync(auditLog, cancellationToken);

            _logger.LogInformation(
                "AUDIT: Medical records accessed. PatientId: {PatientId}. Action: {Action}. Timestamp: {Timestamp}",
                request.PatientId,
                "VIEW_LAB_REPORTS",
                DateTime.UtcNow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to write audit log for PatientId: {PatientId}", request.PatientId);
        }

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