using DoctorAppointmentSystem.Domain.Ratings;

namespace DoctorAppointmentSystem.Application.Abstractions.Ratings;

public interface IRatingSummaryRepository
{
    Task<DoctorRatingSummary?> GetByDoctorUserIdAsync(Guid doctorUserId, CancellationToken cancellationToken = default);

    Task AddAsync(DoctorRatingSummary summary, CancellationToken cancellationToken = default);
}
