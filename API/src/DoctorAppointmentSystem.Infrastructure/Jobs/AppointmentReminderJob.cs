using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Email;
using DoctorAppointmentSystem.Application.Abstractions.Jobs;
using DoctorAppointmentSystem.Domain.Appointments;
using Microsoft.Extensions.Logging;

namespace DoctorAppointmentSystem.Infrastructure.Jobs;

internal sealed class AppointmentReminderJob : IAppointmentReminderJob
{
    private readonly IAppointmentRepository _appointments;
    private readonly IUserRepository _users;
    private readonly IEmailService _emailService;
    private readonly ILogger<AppointmentReminderJob> _logger;

    public AppointmentReminderJob(
        IAppointmentRepository appointments,
        IUserRepository users,
        IEmailService emailService,
        ILogger<AppointmentReminderJob> logger)
    {
        _appointments = appointments;
        _users = users;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task SendReminderAsync(
        Guid appointmentId,
        string reminderType,
        CancellationToken cancellationToken)
    {
        var appointment = await _appointments.GetByIdAsync(appointmentId, cancellationToken);

        // Appointment was cancelled after the job was scheduled — skip silently
        if (appointment is null || appointment.Status == AppointmentStatus.Cancelled)
        {
            _logger.LogInformation(
                "Skipping {ReminderType} reminder for appointment {AppointmentId} — not found or cancelled.",
                reminderType, appointmentId);
            return;
        }

        var patient = await _users.GetByIdAsync(appointment.PatientUserId, cancellationToken);
        if (patient is null)
        {
            _logger.LogWarning(
                "Skipping reminder for appointment {AppointmentId} — patient {PatientId} not found.",
                appointmentId, appointment.PatientUserId);
            return;
        }

        var doctor = await _users.GetByIdAsync(appointment.DoctorUserId, cancellationToken);
        if (doctor is null)
        {
            _logger.LogWarning(
                "Skipping reminder for appointment {AppointmentId} — doctor {DoctorId} not found.",
                appointmentId, appointment.DoctorUserId);
            return;
        }

        await _emailService.SendAppointmentReminderAsync(
            toEmail: patient.Email,
            toName: $"{patient.FirstName} {patient.LastName}",
            doctorName: $"{doctor.FirstName} {doctor.LastName}",
            appointmentStart: appointment.StartUtc,
            reminderType: reminderType,
            cancellationToken: cancellationToken);

        _logger.LogInformation(
            "Sent {ReminderType} reminder for appointment {AppointmentId} to {Email}.",
            reminderType, appointmentId, patient.Email);
    }
}