using DoctorAppointmentSystem.Application.Abstractions.Jobs;
using Hangfire;

namespace DoctorAppointmentSystem.Infrastructure.Jobs;
internal sealed class HangfireLabReportNotificationScheduler : ILabReportNotificationScheduler
{
    public void EnqueueReportEmail(Guid labReportId)
    {
        BackgroundJob.Enqueue<ILabReportEmailJob>(
            job => job.SendReportEmailAsync(labReportId, CancellationToken.None));
    }
}
