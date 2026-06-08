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


}