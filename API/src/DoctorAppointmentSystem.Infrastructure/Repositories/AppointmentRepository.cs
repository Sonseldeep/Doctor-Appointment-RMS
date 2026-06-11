using DoctorAppointmentSystem.Application.Abstractions.Appointments;
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

    public async Task<IReadOnlyList<AppointmentWithDetailsDto>> GetForPatientWithDetailsAsync(
        Guid patientUserId,
        CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        return await _db.Appointments
            .AsNoTracking()
            .Where(a => a.PatientUserId == patientUserId)
            .Join(
                _db.Users.AsNoTracking(),
                a => a.DoctorUserId,
                doctorUser => doctorUser.Id,
                (a, doctorUser) => new { a, doctorUser })
            .Join(
                _db.DoctorProfiles.AsNoTracking(),
                x => x.a.DoctorUserId,
                dp => dp.UserId,
                (x, dp) => new { x.a, x.doctorUser, dp })
            .Join(
                _db.Users.AsNoTracking(),
                x => x.a.PatientUserId,
                patientUser => patientUser.Id,
                (x, patientUser) => new { x.a, x.doctorUser, x.dp, patientUser })
            .LeftJoin(
                _db.PatientProfiles.AsNoTracking(),
                x => x.a.PatientUserId,
                pp => pp.UserId,
                (x, pp) => new { x.a, x.doctorUser, x.dp, x.patientUser, pp })
            .OrderByDescending(x => x.a.StartUtc)
            .Select(x => new AppointmentWithDetailsDto(
                x.a.Id,
                x.a.PatientUserId,
                x.a.DoctorUserId,
                x.a.StartUtc,
                x.a.EndUtc,
                x.a.Status,
                x.a.Notes,
                x.doctorUser.FirstName,
                x.doctorUser.LastName,
                x.dp.NmcNumber,
                x.dp.Specialization,
                x.patientUser.FirstName,
                x.patientUser.LastName,
                x.pp != null ? x.pp.Sex : Sex.Unknown,
                x.pp != null ? CalculateAge(x.pp.DateOfBirth, today) : 0))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AppointmentWithDetailsDto>> GetForDoctorWithDetailsAsync(
        Guid doctorUserId,
        CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        return await _db.Appointments
            .AsNoTracking()
            .Where(a => a.DoctorUserId == doctorUserId)
            .Join(
                _db.Users.AsNoTracking(),
                a => a.DoctorUserId,
                doctorUser => doctorUser.Id,
                (a, doctorUser) => new { a, doctorUser })
            .Join(
                _db.DoctorProfiles.AsNoTracking(),
                x => x.a.DoctorUserId,
                dp => dp.UserId,
                (x, dp) => new { x.a, x.doctorUser, dp })
            .Join(
                _db.Users.AsNoTracking(),
                x => x.a.PatientUserId,
                patientUser => patientUser.Id,
                (x, patientUser) => new { x.a, x.doctorUser, x.dp, patientUser })
            .LeftJoin(
                _db.PatientProfiles.AsNoTracking(),
                x => x.a.PatientUserId,
                pp => pp.UserId,
                (x, pp) => new { x.a, x.doctorUser, x.dp, x.patientUser, pp })
            .OrderByDescending(x => x.a.StartUtc)
            .Select(x => new AppointmentWithDetailsDto(
                x.a.Id,
                x.a.PatientUserId,
                x.a.DoctorUserId,
                x.a.StartUtc,
                x.a.EndUtc,
                x.a.Status,
                x.a.Notes,
                x.doctorUser.FirstName,
                x.doctorUser.LastName,
                x.dp.NmcNumber,
                x.dp.Specialization,
                x.patientUser.FirstName,
                x.patientUser.LastName,
                x.pp != null ? x.pp.Sex : Sex.Unknown,
                x.pp != null ? CalculateAge(x.pp.DateOfBirth, today) : 0))
            .ToListAsync(cancellationToken);
    }

    private static int CalculateAge(DateOnly dateOfBirth, DateOnly today)
    {
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth > today.AddYears(-age))
            age--;
        return age;
    }
}