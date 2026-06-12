using DoctorAppointmentSystem.Domain.Abstractions;
using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Availability;

public sealed class DoctorAvailability : Entity
{
    private readonly List<DoctorAvailabilitySlot> _slots = [];

    private const int MinSlotDurationMinutes = 15;
    private const int MaxSlotDurationMinutes = 120;

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


    public static ErrorOr<DoctorAvailability> Create(
        Guid doctorUserId,
        DateOnly date,
        TimeOnly startTime,
        TimeOnly endTime,
        int slotDurationMinutes)
    {
        var validation = ValidateWindow(startTime, endTime, slotDurationMinutes);
        
        if (validation.IsError)
        {
            return validation.Errors;
        }

        return new DoctorAvailability(
            doctorUserId,
            date,
            startTime,
            endTime,
            slotDurationMinutes);
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

        var validation = ValidateWindow(startTime, endTime, slotDurationMinutes);
        
        if (validation.IsError)
        {
            return validation.Errors;
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
        return _slots.Any(s => s.IsBooked)
            ? AvailabilityErrors.CannotDeleteWithBookedSlots
            : Result.Success;
    }


    public static ErrorOr<Success> ValidateWindow(
        TimeOnly startTime,
        TimeOnly endTime,
        int slotDurationMinutes)
    {
        if (endTime <= startTime)
        {
            return AvailabilityErrors.EndBeforeStart;
        }

        if (slotDurationMinutes < MinSlotDurationMinutes ||
            slotDurationMinutes > MaxSlotDurationMinutes)
        {
            return AvailabilityErrors.InvalidSlotDuration;
        }

        var totalMinutes =
            (endTime.ToTimeSpan() - startTime.ToTimeSpan()).TotalMinutes;

        if (totalMinutes < slotDurationMinutes)
        {
            return AvailabilityErrors.WindowTooShort;
        }

        return Result.Success;
    }


    private void GenerateSlots()
    {
        var current = StartTime;
        var step = TimeSpan.FromMinutes(SlotDurationMinutes);

        while (current.Add(step) <= EndTime)
        {
            var next = current.Add(step);

            _slots.Add(
                DoctorAvailabilitySlot.Create(Id, current, next)
            );

            current = next;
        }
    }
}