using DoctorAppointmentSystem.Domain.Abstractions;



namespace DoctorAppointmentSystem.Domain.Notifications;

public sealed class Notification : Entity
{
    private Notification() { }

    private Notification(
        Guid userId,
        string title,
        string message,
        NotificationType type,
        Guid? appointmentId)
        : base(Guid.NewGuid())
    {
        UserId = userId;
        Title = title;
        Message = message;
        Type = type;
        AppointmentId = appointmentId;
        IsRead = false;
        CreatedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid UserId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string Message { get; private set; } = string.Empty;

    public NotificationType Type { get; private set; }

    public Guid? AppointmentId { get; private set; }

    public bool IsRead { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public static Notification Create(
        Guid userId,
        string title,
        string message,
        NotificationType type,
        Guid? appointmentId = null)
        => new(userId, title, message, type, appointmentId);

    public void MarkAsRead()
    {
        IsRead = true;
    }
}
