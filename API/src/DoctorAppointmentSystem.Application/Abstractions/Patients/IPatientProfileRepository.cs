using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Abstractions.Patients;

public interface IPatientProfileRepository
{
    Task<PatientProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task AddAsync(PatientProfile profile, CancellationToken cancellationToken);
}