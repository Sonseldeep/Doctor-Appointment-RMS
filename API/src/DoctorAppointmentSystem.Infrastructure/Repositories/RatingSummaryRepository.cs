using DoctorAppointmentSystem.Application.Abstractions.Ratings;
using DoctorAppointmentSystem.Domain.Ratings;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class RatingSummaryRepository : IRatingSummaryRepository
{
    private readonly ApplicationDbContext _db;

    public RatingSummaryRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<DoctorRatingSummary?> GetByDoctorUserIdAsync(
        Guid doctorUserId,
        CancellationToken cancellationToken = default)
        => await _db.DoctorRatingSummaries
            .FirstOrDefaultAsync(s => s.DoctorUserId == doctorUserId, cancellationToken);

    public async Task AddAsync(DoctorRatingSummary summary, CancellationToken cancellationToken = default)
        => await _db.DoctorRatingSummaries.AddAsync(summary, cancellationToken);
}