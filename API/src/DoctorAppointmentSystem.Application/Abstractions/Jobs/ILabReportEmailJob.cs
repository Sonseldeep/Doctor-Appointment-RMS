namespace DoctorAppointmentSystem.Application.Abstractions.Jobs;

public interface ILabReportEmailJob
{
    Task SendReportEmailAsync(Guid labReportId, CancellationToken cancellationToken);
}
