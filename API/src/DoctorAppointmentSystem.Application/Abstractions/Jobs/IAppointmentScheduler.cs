namespace DoctorAppointmentSystem.Application.Abstractions.Jobs;

public interface IAppointmentScheduler
{
    void ScheduleReminders(Guid appointmentId, DateTimeOffset startUtc);
}