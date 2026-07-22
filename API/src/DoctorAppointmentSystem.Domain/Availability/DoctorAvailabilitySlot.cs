using DoctorAppointmentSystem.Domain.Abstractions;
using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Availability;


public sealed class DoctorAvailabilitySlot : Entity
{
    private DoctorAvailabilitySlot() { }

    private DoctorAvailabilitySlot(
        Guid availabilityId,
        TimeOnly startTime,
        TimeOnly endTime)
        : base(Guid.NewGuid())
    {
        AvailabilityId = availabilityId;
        StartTime = startTime;
        EndTime = endTime;
        IsBooked = false;
    }

    public Guid AvailabilityId { get; private set; }

    public TimeOnly StartTime { get; private set; }

    public TimeOnly EndTime { get; private set; }

    public bool IsBooked { get; private set; }

    public Guid? AppointmentId { get; private set; }

    public DoctorAvailability Availability { get; private set; } = null!;


    public static DoctorAvailabilitySlot Create(
        Guid availabilityId,
        TimeOnly startTime,
        TimeOnly endTime)
    {
        return new DoctorAvailabilitySlot(availabilityId, startTime, endTime);
    }


    public ErrorOr<Success> Book(Guid appointmentId)
    {
        if (IsBooked)
        {
            return AvailabilityErrors.SlotAlreadyBooked;
        }

        IsBooked = true;
        AppointmentId = appointmentId;
        return Result.Success;
    }

  
    public void Release()
    {
        IsBooked = false;
        AppointmentId = null;
    }
}
