using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;
using DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;
using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Abstractions.Doctors;

public interface IDoctorProfileRepository
{
    Task<DoctorProfile?> GetByIdAsync(Guid doctorProfileId, CancellationToken cancellationToken);
    Task<DoctorProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task AddAsync(DoctorProfile profile, CancellationToken cancellationToken);

    Task<IReadOnlyList<DoctorProfile>> GetActiveAsync(CancellationToken cancellationToken);
    
    Task<IReadOnlyList<DoctorProfile>> GetAllWithUserAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<DoctorProfile>> GetActiveWithUserAsync(CancellationToken cancellationToken);
    
    
    
    Task<PagedResult<DoctorResponse>> GetActivePagedAsync(
        GetDoctorsQuery filters,
        CancellationToken cancellationToken);

    Task<PagedResult<AdminDoctorResponse>> GetAllPagedAsync(
        GetAllDoctorsQuery filters,
        CancellationToken cancellationToken);


}