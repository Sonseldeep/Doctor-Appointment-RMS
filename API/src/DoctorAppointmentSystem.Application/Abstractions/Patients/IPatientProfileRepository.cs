using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Application.Abstractions.Patients;

public interface IPatientProfileRepository
{
    Task<PatientProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task AddAsync(PatientProfile profile, CancellationToken cancellationToken);
    
    Task<PagedResult<AdminPatientResponse>> GetPagedWithUserAsync(
        GetAllPatientsQuery filters,
        CancellationToken cancellationToken);

    Task<List<(PatientProfile Patient, User User)>> SearchByNameOrEmailAsync(string searchTerm, CancellationToken cancellationToken = default);
}