using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Appointments;

public static class AppointmentErrors
{
    public static Error NotFound => Error.NotFound(
        code: "Appointment.NotFound",
        description: "Appointment not found.");

    public static Error Forbidden => Error.Forbidden(
        code: "Appointment.Forbidden",
        description: "You are not allowed to perform this operation.");

    public static Error InvalidStatus => Error.Validation(
        code: "Appointment.InvalidStatus",
        description: "Invalid appointment status transition.");

    public static Error SlotNotAvailable => Error.Conflict(
        code: "Appointment.SlotNotAvailable",
        description: "This time slot is not available.");

    public static Error InvalidTime => Error.Validation(
        code: "Appointment.InvalidTime",
        description: "Invalid appointment time range.");
}