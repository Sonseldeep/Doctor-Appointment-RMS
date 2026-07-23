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
    
    
    public static Error DailyQuotaExceeded(int maxAppointments) => 
        Error.Conflict(
            code: "Appointment.DailyQuotaExceeded",
            description: $"Doctor has reached maximum capacity of {maxAppointments} appointments for this day.");
    
    public static Error CannotBookInPast => 
        Error.Validation(
            code: "Appointment.CannotBookInPast",
            description: "Cannot book appointments in the past.");
    
    
    public static Error InvalidDuration => 
        Error.Validation(
            code: "Appointment.InvalidDuration",
            description: "Appointment end time must be after start time.");

    public static Error PatientSlotConflict => 
        Error.Conflict(
            code: "Appointment.PatientSlotConflict",
            description: "You already have an appointment booked during this time slot.");
    
    public static Error PatientAlreadyBookedDoctorToday =>
        Error.Conflict(
            code: "Appointment.PatientAlreadyBookedDoctorToday",
            description: "You already have an active appointment with this doctor on this day.");
}