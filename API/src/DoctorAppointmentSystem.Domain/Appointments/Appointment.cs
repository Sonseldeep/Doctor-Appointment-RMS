using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Appointments;

public sealed class Appointment : Entity
{
    private Appointment() { }

    private Appointment(
        Guid patientUserId,
        Guid doctorUserId,
        DateTimeOffset startUtc,
        DateTimeOffset endUtc,
        string? notes)
        : base(Guid.NewGuid())
    {
        PatientUserId = patientUserId;
        DoctorUserId = doctorUserId;
        StartUtc = startUtc;
        EndUtc = endUtc;
        Notes = notes;
        Status = AppointmentStatus.Pending;
        CreatedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid PatientUserId { get; private set; }
    public Guid DoctorUserId { get; private set; }

    public DateTimeOffset StartUtc { get; private set; }
    public DateTimeOffset EndUtc { get; private set; }

    public string? Notes { get; private set; }

    public AppointmentStatus Status { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset? ConfirmedAtUtc { get; private set; }
    public DateTimeOffset? CancelledAtUtc { get; private set; }
    public DateTimeOffset? CompletedAtUtc { get; private set; }

    public static Appointment Create(
        Guid patientUserId,
        Guid doctorUserId,
        DateTimeOffset startUtc,
        DateTimeOffset endUtc,
        string? notes)
        => new(patientUserId, doctorUserId, startUtc, endUtc, notes);

    public void Confirm(DateTimeOffset utcNow)
    {
        if (Status != AppointmentStatus.Pending)
            throw new InvalidOperationException("Only pending appointments can be confirmed.");

        Status = AppointmentStatus.Confirmed;
        ConfirmedAtUtc = utcNow;
    }

    public void Cancel(DateTimeOffset utcNow)
    {
        if (Status is AppointmentStatus.Cancelled or AppointmentStatus.Completed)
            throw new InvalidOperationException("Appointment cannot be cancelled.");

        Status = AppointmentStatus.Cancelled;
        CancelledAtUtc = utcNow;
    }

    public void Complete(DateTimeOffset utcNow)
    {
        if (Status != AppointmentStatus.Confirmed)
            throw new InvalidOperationException("Only confirmed appointments can be completed.");

        Status = AppointmentStatus.Completed;
        CompletedAtUtc = utcNow;
    }
}