using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class DoctorProfileRepository : IDoctorProfileRepository
{
    private readonly ApplicationDbContext _db;

    public DoctorProfileRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<DoctorProfile?> GetByIdAsync(Guid doctorProfileId, CancellationToken cancellationToken)
        => await _db.DoctorProfiles.SingleOrDefaultAsync(x => x.Id == doctorProfileId, cancellationToken);

    public async Task<DoctorProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        => await _db.DoctorProfiles.SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

    public async Task AddAsync(DoctorProfile profile, CancellationToken cancellationToken)
        => await _db.DoctorProfiles.AddAsync(profile, cancellationToken);

    public async Task<IReadOnlyList<DoctorProfile>> GetActiveAsync(CancellationToken cancellationToken)
        => await _db.DoctorProfiles
            .Where(x => x.Status == DoctorStatus.Active)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    
    public async Task<IReadOnlyList<DoctorProfile>> GetAllWithUserAsync(CancellationToken cancellationToken)
        => await _db.DoctorProfiles
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    
    public async Task<IReadOnlyList<DoctorProfile>> GetActiveWithUserAsync(CancellationToken cancellationToken)
        => await _db.DoctorProfiles
            .Include(x => x.User)
            .Where(x => x.Status == DoctorStatus.Active)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
}