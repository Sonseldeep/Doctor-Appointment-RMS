using DoctorAppointmentSystem.Domain.Labs;
using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Application.Abstractions.Labs;

public interface ILabReportRepository
{
    Task AddAsync(LabReport report, CancellationToken cancellationToken = default);
    Task<IEnumerable<LabReport>> GetByPatientIdAsync(Guid patientId, CancellationToken cancellationToken = default);
    Task<LabReport?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    
    Task<List<(LabReport Report, User Patient)>> GetSentHistoryByLabTechnicianIdAsync(
        Guid labTechnicianId,
        CancellationToken cancellationToken = default);


}