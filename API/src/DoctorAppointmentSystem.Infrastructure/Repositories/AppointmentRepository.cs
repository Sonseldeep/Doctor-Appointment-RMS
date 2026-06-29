using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class AppointmentRepository : IAppointmentRepository
{
    private readonly ApplicationDbContext _db;

    public AppointmentRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Appointment?> GetByIdAsync(Guid appointmentId, CancellationToken cancellationToken)
        => await _db.Appointments.SingleOrDefaultAsync(x => x.Id == appointmentId, cancellationToken);

    public async Task AddAsync(Appointment appointment, CancellationToken cancellationToken)
        => await _db.Appointments.AddAsync(appointment, cancellationToken);

    public async Task<IReadOnlyList<Appointment>> GetForPatientAsync(Guid patientUserId, CancellationToken cancellationToken)
        => await _db.Appointments
            .Where(x => x.PatientUserId == patientUserId)
            .OrderByDescending(x => x.StartUtc)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Appointment>> GetForDoctorAsync(Guid doctorUserId, CancellationToken cancellationToken)
        => await _db.Appointments
            .Where(x => x.DoctorUserId == doctorUserId)
            .OrderByDescending(x => x.StartUtc)
            .ToListAsync(cancellationToken);

    public async Task<bool> DoctorHasOverlapAsync(
        Guid doctorUserId,
        DateTimeOffset startUtc,
        DateTimeOffset endUtc,
        CancellationToken cancellationToken)
    {
        return await _db.Appointments.AnyAsync(x =>
                x.DoctorUserId == doctorUserId
                && x.Status != AppointmentStatus.Cancelled
                && x.Status != AppointmentStatus.Completed
                && x.StartUtc < endUtc
                && x.EndUtc > startUtc,
            cancellationToken);
    }

    public async Task<int> GetDoctorAppointmentCountForDateAsync(
        Guid doctorUserId,
        DateTime appointmentDate,
        CancellationToken cancellationToken)
    {
        return await _db.Appointments
            .CountAsync(
                a => a.DoctorUserId == doctorUserId &&
                     a.StartUtc.Date == appointmentDate &&
                     (a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Confirmed),
                cancellationToken);
    }

    public async Task<PagedResult<AppointmentWithDetailsDto>> GetForPatientWithDetailsAsync(
        Guid patientUserId,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // 1. Get the total count
        var baseQuery = _db.Appointments.Where(a => a.PatientUserId == patientUserId);
        var totalCount = await baseQuery.CountAsync(cancellationToken);

        // 2. Perform the Joins
        var query = baseQuery
            .AsNoTracking()
            .Join(_db.Users.AsNoTracking(), a => a.DoctorUserId, u => u.Id, (a, du) => new { a, du })
            .Join(_db.DoctorProfiles.AsNoTracking(), x => x.a.DoctorUserId, dp => dp.UserId, (x, dp) => new { x.a, x.du, dp })
            .Join(_db.Users.AsNoTracking(), x => x.a.PatientUserId, pu => pu.Id, (x, pu) => new { x.a, x.du, x.dp, pu })
            .LeftJoin(_db.PatientProfiles.AsNoTracking(), x => x.a.PatientUserId, pp => pp.UserId, (x, pp) => new { x.a, x.du, x.dp, x.pu, pp });

        // 3. Paginate and Select
        var items = await query
            .OrderByDescending(x => x.a.StartUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AppointmentWithDetailsDto(
                x.a.Id, x.a.PatientUserId, x.a.DoctorUserId, x.a.StartUtc, x.a.EndUtc,
                x.a.Status, x.a.Notes, x.du.FirstName, x.du.LastName, x.dp.NmcNumber,
                x.du.ProfilePhotoUrl, x.dp.Specialization, x.pu.FirstName, x.pu.LastName,
                x.pp != null ? x.pp.Sex : Sex.Unknown,
                x.pp != null ? CalculateAge(x.pp.DateOfBirth, today) : 0,
                x.pu.ProfilePhotoUrl
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<AppointmentWithDetailsDto>(items, totalCount, page, pageSize);
    }

    public async Task<PagedResult<AppointmentWithDetailsDto>> GetForDoctorWithDetailsAsync(
        Guid doctorUserId,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // 1. Get the total count
        var baseQuery = _db.Appointments.Where(a => a.DoctorUserId == doctorUserId);
        var totalCount = await baseQuery.CountAsync(cancellationToken);

        // 2. Perform the Joins
        var query = baseQuery
            .AsNoTracking()
            .Join(_db.Users.AsNoTracking(), a => a.DoctorUserId, u => u.Id, (a, du) => new { a, du })
            .Join(_db.DoctorProfiles.AsNoTracking(), x => x.a.DoctorUserId, dp => dp.UserId, (x, dp) => new { x.a, x.du, dp })
            .Join(_db.Users.AsNoTracking(), x => x.a.PatientUserId, pu => pu.Id, (x, pu) => new { x.a, x.du, x.dp, pu })
            .LeftJoin(_db.PatientProfiles.AsNoTracking(), x => x.a.PatientUserId, pp => pp.UserId, (x, pp) => new { x.a, x.du, x.dp, x.pu, pp });

        // 3. Paginate and Select
        var items = await query
            .OrderByDescending(x => x.a.StartUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AppointmentWithDetailsDto(
                x.a.Id, x.a.PatientUserId, x.a.DoctorUserId, x.a.StartUtc, x.a.EndUtc,
                x.a.Status, x.a.Notes, x.du.FirstName, x.du.LastName, x.dp.NmcNumber,
                x.du.ProfilePhotoUrl, x.dp.Specialization, x.pu.FirstName, x.pu.LastName,
                x.pp != null ? x.pp.Sex : Sex.Unknown,
                x.pp != null ? CalculateAge(x.pp.DateOfBirth, today) : 0,
                x.pu.ProfilePhotoUrl
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<AppointmentWithDetailsDto>(items, totalCount, page, pageSize);
    }

    public async Task<bool> HasCompletedAppointmentAsync(
        Guid patientUserId,
        Guid doctorUserId,
        CancellationToken cancellationToken)
        => await _db.Appointments.AnyAsync(
            a => a.PatientUserId == patientUserId
                 && a.DoctorUserId == doctorUserId
                 && a.Status == AppointmentStatus.Completed,
            cancellationToken);

    private static int CalculateAge(DateOnly dateOfBirth, DateOnly today)
    {
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth > today.AddYears(-age))
        {
            age--;
        }
        return age;
    }

    public async Task<bool> PatientHasOverlapAsync(
        Guid patientUserId,
        DateTimeOffset startUtc,
        DateTimeOffset endUtc,
        CancellationToken cancellationToken)
    {
        return await _db.Appointments.AsNoTracking().AnyAsync(x =>
                x.PatientUserId == patientUserId
                && x.Status != AppointmentStatus.Cancelled
                && x.Status != AppointmentStatus.Completed
                && x.StartUtc < endUtc
                && x.EndUtc > startUtc,
            cancellationToken);
    }
}