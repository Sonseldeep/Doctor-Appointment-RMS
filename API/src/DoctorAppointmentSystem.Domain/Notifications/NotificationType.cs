namespace DoctorAppointmentSystem.Domain.Notifications;

public enum NotificationType
{
    AppointmentBooked = 1,
    AppointmentConfirmed = 2,
    AppointmentCancelled = 3,
    AppointmentCompleted = 4,
    DoctorApproved = 5,
    DoctorSuspended = 6
}
