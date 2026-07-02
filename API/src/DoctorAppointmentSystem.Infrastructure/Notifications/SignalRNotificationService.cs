using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DoctorAppointmentSystem.Infrastructure.Notifications;

internal sealed class SignalRNotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendToUserAsync(
        Guid userId,
        Notification notification,
        CancellationToken cancellationToken = default)
    {
        var groupName = NotificationHub.GetGroupName(userId.ToString());

        var payload = new NotificationResponse(
            notification.Id,
            notification.Title,
            notification.Message,
            notification.Type.ToString(),
            notification.AppointmentId,
            notification.IsRead,
            notification.CreatedAtUtc);

        await _hubContext.Clients
            .Group(groupName)
            .SendAsync("ReceiveNotification", payload, cancellationToken);
    }
    
    
    
    public async Task SendAppointmentBookedToDoctorAsync(
        Guid doctorUserId,
        AppointmentResponse appointment,
        CancellationToken cancellationToken = default)
    {
        var group = NotificationHub.GetGroupName(doctorUserId.ToString());

        await _hubContext.Clients
            .Group(group)
            .SendAsync("AppointmentBooked", appointment, cancellationToken);
    }
    
    
    public async Task SendAppointmentStatusChangedAsync(
        Guid userId,
        Guid appointmentId,
        string newStatus,
        CancellationToken cancellationToken = default)
    {
        var group = NotificationHub.GetGroupName(userId.ToString());

        await _hubContext.Clients
            .Group(group)
            .SendAsync("AppointmentStatusChanged", new { appointmentId, newStatus }, cancellationToken);
    }
    
    public async Task SendClinicalNoteAddedToPatientAsync(
        Guid patientUserId,
        ClinicalNoteResponse clinicalNote,
        CancellationToken cancellationToken = default)
    {
        var group = NotificationHub.GetGroupName(patientUserId.ToString());

        await _hubContext.Clients
            .Group(group)
            .SendAsync("ClinicalNoteAdded", clinicalNote, cancellationToken);
    }

    public async Task SendLabReportAddedToPatientAsync(
        Guid patientUserId,
        LabReportResponse labReport,
        CancellationToken cancellationToken = default)
    {
        var group = NotificationHub.GetGroupName(patientUserId.ToString());

        await _hubContext.Clients
            .Group(group)
            .SendAsync("LabReportAdded", labReport, cancellationToken);
    }

   
    
    public async Task NotifyDashboardStatsChangedAsync(
        string reason,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .Group(NotificationHub.AdminDashboardGroup)
            .SendAsync("DashboardStatsChanged", new { reason, occurredAtUtc = DateTimeOffset.UtcNow }, cancellationToken);
    }
}