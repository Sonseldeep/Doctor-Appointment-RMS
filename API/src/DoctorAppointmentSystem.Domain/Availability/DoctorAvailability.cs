using DoctorAppointmentSystem.Domain.Abstractions;
using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Availability;


public sealed class DoctorAvailability : Entity
{
    private readonly List<DoctorAvailabilitySlot> _slots = [];

    private DoctorAvailability() { }

    private DoctorAvailability(
        Guid doctorUserId,
        DateOnly date,
        TimeOnly startTime,
        TimeOnly endTime,
        int slotDurationMinutes)
        : base(Guid.NewGuid())
    {
        DoctorUserId = doctorUserId;
        Date = date;
        StartTime = startTime;
        EndTime = endTime;
        SlotDurationMinutes = slotDurationMinutes;
        CreatedAtUtc = DateTimeOffset.UtcNow;

        GenerateSlots();
    }

    public Guid DoctorUserId { get; private set; }

    public DateOnly Date { get; private set; }

    public TimeOnly StartTime { get; private set; }

    public TimeOnly EndTime { get; private set; }

    public int SlotDurationMinutes { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public IReadOnlyList<DoctorAvailabilitySlot> Slots => _slots.AsReadOnly();


    public static ErrorOr.ErrorOr<DoctorAvailability> Create(
        Guid doctorUserId,
        DateOnly date,
        TimeOnly startTime,
        TimeOnly endTime,
        int slotDurationMinutes)
    {
        if (endTime <= startTime)
        {
            return AvailabilityErrors.EndBeforeStart;
        }

        if (slotDurationMinutes is < 15 or > 120)
        {
            return AvailabilityErrors.InvalidSlotDuration;
        }
        var totalMinutes = (endTime.ToTimeSpan() - startTime.ToTimeSpan()).TotalMinutes;
        if (totalMinutes < slotDurationMinutes)
        {
            return AvailabilityErrors.WindowTooShort;
        }

        return new DoctorAvailability(doctorUserId, date, startTime, endTime, slotDurationMinutes);
    }


    private void GenerateSlots()
    {
        var current = StartTime;
        while (true)
        {
            var next = current.Add(TimeSpan.FromMinutes(SlotDurationMinutes));
            if (next > EndTime)
            {
                break;
            }

            _slots.Add(DoctorAvailabilitySlot.Create(Id, current, next));
            current = next;
        }
    }


    public ErrorOr<Success> Update(
        TimeOnly startTime,
        TimeOnly endTime,
        int slotDurationMinutes)
    {
        if (_slots.Any(s => s.IsBooked))
        {
            return AvailabilityErrors.CannotUpdateWithBookedSlots;
        }

        if (endTime <= startTime)
        {
            return AvailabilityErrors.EndBeforeStart;
        }

        if (slotDurationMinutes is < 15 or > 120)
        {
            return AvailabilityErrors.InvalidSlotDuration;
        }
        var totalMinutes = (endTime.ToTimeSpan() - startTime.ToTimeSpan()).TotalMinutes;
        if (totalMinutes < slotDurationMinutes)
        {
            return AvailabilityErrors.WindowTooShort;
        }

        StartTime = startTime;
        EndTime = endTime;
        SlotDurationMinutes = slotDurationMinutes;

        _slots.Clear();
        GenerateSlots();

        return Result.Success;
    }


    public ErrorOr<Success> EnsureCanDelete()
    {
        if (_slots.Any(s => s.IsBooked))
        {
            return AvailabilityErrors.CannotDeleteWithBookedSlots;
        }

        return ErrorOr.Result.Success;
    }
    
}
