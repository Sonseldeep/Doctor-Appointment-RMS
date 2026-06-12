using DoctorAppointmentSystem.Domain.Ratings;

namespace DoctorAppointmentSystem.Application.Abstractions.Ratings;

public interface IRatingRepository
{
    Task<DoctorRating?> GetByPatientAndDoctorAsync(Guid patientUserId, Guid doctorUserId, CancellationToken cancellationToken = default);

    Task<DoctorRating?> GetByIdAsync(Guid ratingId, CancellationToken cancellationToken = default);

    Task<List<DoctorRating>> GetByDoctorAsync(Guid doctorUserId, CancellationToken cancellationToken = default);

    Task AddAsync(DoctorRating rating, CancellationToken cancellationToken = default);

    void Remove(DoctorRating rating);
}
