namespace DoctorAppointmentSystem.Application.Abstractions.Jobs;

public interface IAppointmentReminderJob
{
    Task SendReminderAsync(Guid appointmentId, string reminderType, CancellationToken cancellationToken);
}