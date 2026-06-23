using DoctorAppointmentSystem.Domain.Labs;

namespace DoctorAppointmentSystem.Application.Abstractions.Labs;

public interface ILabReportRepository
{
    Task AddAsync(LabReport report, CancellationToken cancellationToken = default);
    Task<IEnumerable<LabReport>> GetByPatientIdAsync(Guid patientId, CancellationToken cancellationToken = default);

}