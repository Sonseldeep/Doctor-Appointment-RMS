using DoctorAppointmentSystem.Application.Abstractions.Jobs;
using Hangfire;

namespace DoctorAppointmentSystem.Infrastructure.Jobs;

internal sealed class HangfireAppointmentScheduler : IAppointmentScheduler
{
    public void ScheduleReminders(Guid appointmentId, DateTimeOffset startUtc)
    {
        var now = DateTimeOffset.UtcNow;
        var oneDayBefore = startUtc.AddHours(-24);
        var oneHourBefore = startUtc.AddHours(-1);

        if (oneDayBefore > now)
        {
            BackgroundJob.Schedule<IAppointmentReminderJob>(
                job => job.SendReminderAsync(appointmentId, "24h", CancellationToken.None),
                oneDayBefore);
        }

        if (oneHourBefore > now)
        {
            BackgroundJob.Schedule<IAppointmentReminderJob>(
                job => job.SendReminderAsync(appointmentId, "1h", CancellationToken.None),
                oneHourBefore);
        }
    }
}