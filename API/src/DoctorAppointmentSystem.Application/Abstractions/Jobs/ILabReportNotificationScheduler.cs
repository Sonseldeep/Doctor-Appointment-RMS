namespace DoctorAppointmentSystem.Application.Abstractions.Jobs;

public interface ILabReportNotificationScheduler
{
    
    void EnqueueReportEmail(Guid labReportId);
}
