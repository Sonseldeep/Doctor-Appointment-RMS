using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Email;
using DoctorAppointmentSystem.Application.Abstractions.Jobs;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Application.Features.Labs.Common;
using Microsoft.Extensions.Logging;

namespace DoctorAppointmentSystem.Infrastructure.Jobs;

internal sealed class LabReportEmailJob : ILabReportEmailJob
{
    private readonly ILabReportRepository _labReports;
    private readonly IUserRepository _users;
    private readonly IPatientProfileRepository _patientProfiles;
    private readonly IAppointmentRepository _appointments;
    private readonly IEmailService _emailService;
    private readonly ILogger<LabReportEmailJob> _logger;

    public LabReportEmailJob(
        ILabReportRepository labReports,
        IUserRepository users,
        IPatientProfileRepository patientProfiles,
        IAppointmentRepository appointments,
        IEmailService emailService,
        ILogger<LabReportEmailJob> logger)
    {
        _labReports = labReports;
        _users = users;
        _patientProfiles = patientProfiles;
        _appointments = appointments;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task SendReportEmailAsync(Guid labReportId, CancellationToken cancellationToken)
    {
        var report = await _labReports.GetByIdAsync(labReportId, cancellationToken);
        
        if (report is null)
        {
            _logger.LogWarning(
                "Skipping lab report email — report {LabReportId} not found.",
                labReportId);
            
            return;
        }

        var patient = await _users.GetByIdAsync(report.PatientId, cancellationToken);
        if (patient is null)
        {
            _logger.LogWarning(
                "Skipping lab report email for report {LabReportId} — patient {PatientId} not found.",
                labReportId, report.PatientId);
            return;
        }

        if (string.IsNullOrWhiteSpace(patient.Email))
        {
            _logger.LogWarning(
                "Skipping lab report email for report {LabReportId} — patient {PatientId} has no email on file.",
                labReportId, report.PatientId);
            return;
        }

        try
        {
            var profile = await _patientProfiles.GetByUserIdAsync(report.PatientId, cancellationToken);

            var associatedAppointment = await LabReportDoctorResolver.ResolveAssociatedAppointmentAsync(
                _appointments, report.PatientId, report.ObservationDateTime, cancellationToken);

            var associatedDoctor = associatedAppointment is not null
                ? await _users.GetByIdAsync(associatedAppointment.DoctorUserId, cancellationToken)
                : null;

            var pdfBytes = LabReportPdfBuilder.Build(report, patient, profile, associatedDoctor);
            var fileName = $"Lab-Report-{report.PanelName}-{report.ObservationDateTime:yyyyMMdd}.pdf"
                .Replace(' ', '-');

            await _emailService.SendLabReportAsync(
                toEmail: patient.Email,
                toName: $"{patient.FirstName} {patient.LastName}",
                labName: report.LabName,
                panelName: report.PanelName,
                observationDateTime: report.ObservationDateTime,
                reportPdf: pdfBytes,
                attachmentFileName: fileName,
                cancellationToken: cancellationToken);

            _logger.LogInformation(
                "Emailed lab report {LabReportId} to {Email}.",
                labReportId, patient.Email);
        }
        catch (Exception ex)
        {
            
            _logger.LogError(
                ex,
                "Failed to email lab report {LabReportId} to patient {PatientId}.",
                labReportId, report.PatientId);
            throw;
        }
    }
}
