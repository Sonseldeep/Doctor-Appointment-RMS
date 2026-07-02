using DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
using DoctorAppointmentSystem.Domain.Notifications;

namespace DoctorAppointmentSystem.Application.Abstractions.Notifications;

public interface INotificationService
{
    Task SendToUserAsync(Guid userId, Notification notification, CancellationToken cancellationToken = default);
    
    
    Task SendAppointmentBookedToDoctorAsync(Guid doctorUserId, AppointmentResponse appointment, CancellationToken cancellationToken = default);
    
    
    Task SendAppointmentStatusChangedAsync(Guid userId, Guid appointmentId, string newStatus, CancellationToken cancellationToken = default);
    
    
    Task SendClinicalNoteAddedToPatientAsync(Guid patientUserId, ClinicalNoteResponse clinicalNote, CancellationToken cancellationToken = default);
    Task SendLabReportAddedToPatientAsync(Guid patientUserId, LabReportResponse labReport, CancellationToken cancellationToken = default);

    Task NotifyDashboardStatsChangedAsync(string reason, CancellationToken cancellationToken = default);

}
