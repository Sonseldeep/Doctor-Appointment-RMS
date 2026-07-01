using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;
using DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;
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

    public async Task<bool> NmcNumberExistsAsync(string nmcNumber, CancellationToken cancellationToken)
        => await _db.DoctorProfiles.AnyAsync(x => x.NmcNumber == nmcNumber, cancellationToken);
    
    public async Task<PagedResult<DoctorResponse>> GetActivePagedAsync(
        GetDoctorsQuery filters,
        CancellationToken cancellationToken)
    {
        var query = _db.DoctorProfiles
            .AsNoTracking()
            .Where(x => x.Status == DoctorStatus.Active)
            .Join(
                _db.Users.AsNoTracking(),
                d => d.UserId,
                u => u.Id,
                (d, u) => new { d, u })
            .GroupJoin(
                _db.DoctorRatingSummaries.AsNoTracking(),
                x => x.d.UserId,
                s => s.DoctorUserId,
                (x, summaries) => new { x.d, x.u, summaries })
            .SelectMany(
                x => x.summaries.DefaultIfEmpty(),
                (x, summary) => new { x.d, x.u, summary });

        if (!string.IsNullOrWhiteSpace(filters.SearchTerm))
        {
            var term = filters.SearchTerm.Trim().ToLower();
            query = query.Where(x =>
                x.u.FirstName.ToLower().Contains(term) ||
                x.u.LastName.ToLower().Contains(term));
        }

        if (filters.Specialization.HasValue)
        {
            query = query.Where(x => x.d.Specialization == filters.Specialization.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.d.CreatedAtUtc)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .Select(x => new DoctorResponse(
                x.d.Id,
                x.d.UserId,
                x.u.FirstName,
                x.u.LastName,
                x.u.ProfilePhotoUrl,
                x.d.NmcNumber,
                x.d.Specialization,
                x.d.ConsultationFee,
                 x.d.Bio,
                x.summary != null && x.summary.TotalRatings > 0
                    ? Math.Round((decimal)x.summary.RatingSum / x.summary.TotalRatings, 1)
                    : 0m,
                x.summary != null ? x.summary.TotalRatings : 0))
            .ToListAsync(cancellationToken);

        return new PagedResult<DoctorResponse>(
            Items: items.AsReadOnly(),
            TotalCount: totalCount,
            Page: filters.Page,
            PageSize: filters.PageSize);
    }


    public async Task<PagedResult<AdminDoctorResponse>> GetAllPagedAsync(
        GetAllDoctorsQuery filters,
        CancellationToken cancellationToken)
    {
        var query = _db.DoctorProfiles
            .AsNoTracking()
            .Join(
                _db.Users.AsNoTracking(),
                d => d.UserId,
                u => u.Id,
                (d, u) => new { d, u });

        if (!string.IsNullOrWhiteSpace(filters.SearchTerm))
        {
            var term = filters.SearchTerm.Trim().ToLower();
            query = query.Where(x =>
                x.u.FirstName.ToLower().Contains(term) ||
                x.u.LastName.ToLower().Contains(term) ||
                x.u.Email.ToLower().Contains(term));
        }

        if (filters.Specialization.HasValue)
        {
            query = query.Where(x => x.d.Specialization == filters.Specialization.Value);
        }
        if (filters.Status.HasValue)
        {
            query = query.Where(x => x.d.Status == filters.Status.Value);
        }
        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.d.CreatedAtUtc)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .Select(x => new AdminDoctorResponse(
                x.d.UserId,
                x.d.Id,
                x.u.FirstName,
                x.u.LastName,
                x.u.Email,
                x.u.ProfilePhotoUrl,
                x.d.NmcNumber,
                x.d.Specialization,
                x.d.ConsultationFee,
                x.d.Status,
                x.d.Bio,
                x.d.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        return new PagedResult<AdminDoctorResponse>(
            Items: items.AsReadOnly(),
            TotalCount: totalCount,
            Page: filters.Page,
            PageSize: filters.PageSize);
    }
}