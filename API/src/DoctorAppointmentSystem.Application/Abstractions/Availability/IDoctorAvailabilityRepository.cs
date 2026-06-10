using DoctorAppointmentSystem.Domain.Availability;

namespace DoctorAppointmentSystem.Application.Abstractions.Availability;

public interface IDoctorAvailabilityRepository
{

    Task<DoctorAvailability?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<DoctorAvailability?> GetByIdWithSlotsAsync(Guid id, CancellationToken cancellationToken);

    
    Task<bool> ExistsForDoctorOnDateAsync(
        Guid doctorUserId,
        DateOnly date,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<DoctorAvailability>> GetByDoctorAsync(
        Guid doctorUserId,
        CancellationToken cancellationToken);

  
    Task<DoctorAvailability?> GetByDoctorAndDateWithSlotsAsync(
        Guid doctorUserId,
        DateOnly date,
        CancellationToken cancellationToken);

    Task<DoctorAvailabilitySlot?> GetSlotWithAvailabilityAsync(
        Guid slotId,
        CancellationToken cancellationToken);
    
    Task<DoctorAvailabilitySlot?> GetSlotByAppointmentIdAsync(
        Guid appointmentId,
        CancellationToken cancellationToken);
    
    Task ReplaceAvailabilityAsync(
        Guid availabilityId,
        TimeOnly startTime,
        TimeOnly endTime,
        int slotDurationMinutes,
        CancellationToken cancellationToken);


    Task AddAsync(DoctorAvailability availability, CancellationToken cancellationToken);

    void Remove(DoctorAvailability availability);
    
    void RemoveSlots(IReadOnlyList<DoctorAvailabilitySlot> slots);
    
    void DetachSlots(IReadOnlyList<DoctorAvailabilitySlot> slots); 
}