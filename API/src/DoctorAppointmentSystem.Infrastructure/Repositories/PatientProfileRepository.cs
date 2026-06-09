using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class PatientProfileRepository : IPatientProfileRepository
{
    private readonly ApplicationDbContext _db;

    public PatientProfileRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PatientProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        => await _db.PatientProfiles.SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

    public async Task AddAsync(PatientProfile profile, CancellationToken cancellationToken)
        => await _db.PatientProfiles.AddAsync(profile, cancellationToken);

    public async Task<PagedResult<AdminPatientResponse>> GetPagedWithUserAsync(
        GetAllPatientsQuery filters,
        CancellationToken cancellationToken)
    {
        var query = _db.PatientProfiles
            .AsNoTracking()
            .Join(
                _db.Users.AsNoTracking().Where(u => u.Role == UserRole.Registered),
                profile => profile.UserId,
                user => user.Id,
                (profile, user) => new { profile, user });

        if (!string.IsNullOrWhiteSpace(filters.SearchTerm))
        {
            var term = filters.SearchTerm.Trim().ToLower();
            query = query.Where(x =>
                x.user.FirstName.ToLower().Contains(term) ||
                x.user.LastName.ToLower().Contains(term) ||
                x.user.Email.ToLower().Contains(term));
        }

        if (filters.Sex.HasValue)
        {
            query = query.Where(x => x.profile.Sex == filters.Sex.Value);
        }

        if (!string.IsNullOrWhiteSpace(filters.Address))
        {
            var city = filters.Address.Trim().ToLower();
            query = query.Where(x =>
                x.profile.Address != null &&
                x.profile.Address.ToLower().Contains(city));
        }

        if (filters.MinAge.HasValue || filters.MaxAge.HasValue)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            if (filters.MinAge.HasValue)
            {
                var maxBirthDate = today.AddYears(-filters.MinAge.Value);
                query = query.Where(x => x.profile.DateOfBirth <= maxBirthDate);
            }

            if (filters.MaxAge.HasValue)
            {
                var minBirthDate = today.AddYears(-(filters.MaxAge.Value + 1)).AddDays(1);
                query = query.Where(x => x.profile.DateOfBirth >= minBirthDate);
            }
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.profile.CreatedAtUtc)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .Select(x => new AdminPatientResponse(
                x.user.Id,
                 x.profile.Id,
                 x.user.FirstName,
                 x.user.LastName,
                 x.user.Email,
                x.user.ProfilePhotoUrl,
                x.profile.Sex,
                CalculateAge(x.profile.DateOfBirth),
                 x.profile.PhoneNumber,
                 x.profile.Address,
                x.profile.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        return new PagedResult<AdminPatientResponse>(
            Items: items.AsReadOnly(),
            TotalCount: totalCount,
            Page: filters.Page,
            PageSize: filters.PageSize);
    }

    private static int CalculateAge(DateOnly dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth > today.AddYears(-age))
        {
            age--;
        }
        return age;
    }
}