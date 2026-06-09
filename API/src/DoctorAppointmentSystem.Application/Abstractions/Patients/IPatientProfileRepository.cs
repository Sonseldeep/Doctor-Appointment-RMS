using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;
using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Abstractions.Patients;

public interface IPatientProfileRepository
{
    Task<PatientProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task AddAsync(PatientProfile profile, CancellationToken cancellationToken);
    
    Task<PagedResult<AdminPatientResponse>> GetPagedWithUserAsync(
        GetAllPatientsQuery filters,
        CancellationToken cancellationToken);
}