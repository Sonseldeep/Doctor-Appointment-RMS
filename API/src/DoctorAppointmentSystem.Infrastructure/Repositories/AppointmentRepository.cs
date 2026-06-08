using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Domain.Appointments;
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
}