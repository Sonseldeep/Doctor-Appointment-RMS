using DoctorAppointmentSystem.Application.Abstractions.Ratings;
using DoctorAppointmentSystem.Domain.Ratings;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class RatingRepository : IRatingRepository
{
    private readonly ApplicationDbContext _db;

    public RatingRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<DoctorRating?> GetByPatientAndDoctorAsync(
        Guid patientUserId,
        Guid doctorUserId,
        CancellationToken cancellationToken = default)
        => await _db.DoctorRatings
            .FirstOrDefaultAsync(
                r => r.PatientUserId == patientUserId && r.DoctorUserId == doctorUserId,
                cancellationToken);

    public async Task<DoctorRating?> GetByIdAsync(
        Guid ratingId,
        CancellationToken cancellationToken = default)
        => await _db.DoctorRatings
            .FirstOrDefaultAsync(r => r.Id == ratingId, cancellationToken);

    public async Task<List<DoctorRating>> GetByDoctorAsync(
        Guid doctorUserId,
        CancellationToken cancellationToken = default)
        => await _db.DoctorRatings
            .AsNoTracking()
            .Where(r => r.DoctorUserId == doctorUserId)
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(DoctorRating rating, CancellationToken cancellationToken = default)
        => await _db.DoctorRatings.AddAsync(rating, cancellationToken);

    public void Remove(DoctorRating rating)
        => _db.DoctorRatings.Remove(rating);
}