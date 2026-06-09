using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Domain.Availability;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class DoctorAvailabilityRepository : IDoctorAvailabilityRepository
{
    private readonly ApplicationDbContext _db;

    public DoctorAvailabilityRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<DoctorAvailability?> GetByIdAsync(
        Guid id, CancellationToken cancellationToken)
        => await _db.DoctorAvailabilities
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<DoctorAvailability?> GetByIdWithSlotsAsync(
        Guid id, CancellationToken cancellationToken)
        => await _db.DoctorAvailabilities
            .Include(x => x.Slots)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<bool> ExistsForDoctorOnDateAsync(
        Guid doctorUserId,
        DateOnly date,
        CancellationToken cancellationToken)
        => await _db.DoctorAvailabilities
            .AnyAsync(x => x.DoctorUserId == doctorUserId && x.Date == date,
                cancellationToken);

    public async Task<IReadOnlyList<DoctorAvailability>> GetByDoctorAsync(
        Guid doctorUserId,
        CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        return await _db.DoctorAvailabilities
            .Include(x => x.Slots)
            .Where(x => x.DoctorUserId == doctorUserId && x.Date >= today)
            .OrderBy(x => x.Date)
            .ToListAsync(cancellationToken);
    }

    public async Task<DoctorAvailability?> GetByDoctorAndDateWithSlotsAsync(
        Guid doctorUserId,
        DateOnly date,
        CancellationToken cancellationToken)
        => await _db.DoctorAvailabilities
            .Include(x => x.Slots)
            .SingleOrDefaultAsync(
                x => x.DoctorUserId == doctorUserId && x.Date == date,
                cancellationToken);

    public async Task<DoctorAvailabilitySlot?> GetSlotWithAvailabilityAsync(
        Guid slotId,
        CancellationToken cancellationToken)
        => await _db.DoctorAvailabilitySlots
            .Include(s => s.Availability)
            .SingleOrDefaultAsync(s => s.Id == slotId, cancellationToken);

    public async Task<DoctorAvailabilitySlot?> GetSlotByAppointmentIdAsync(
        Guid appointmentId,
        CancellationToken cancellationToken)
        => await _db.DoctorAvailabilitySlots
            .SingleOrDefaultAsync(s => s.AppointmentId == appointmentId, cancellationToken);

    public async Task AddAsync(
        DoctorAvailability availability,
        CancellationToken cancellationToken)
        => await _db.DoctorAvailabilities.AddAsync(availability, cancellationToken);

    public void Remove(DoctorAvailability availability)
        => _db.DoctorAvailabilities.Remove(availability);
    
    
    
}
