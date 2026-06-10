using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Availability;

public static class AvailabilityErrors
{
    public static Error NotFound => Error.NotFound(
        code: "Availability.NotFound",
        description: "Doctor availability not found.");

    public static Error SlotNotFound => Error.NotFound(
        code: "Availability.SlotNotFound",
        description: "The requested time slot was not found.");

    public static Error SlotAlreadyBooked => Error.Conflict(
        code: "Availability.SlotAlreadyBooked",
        description: "This time slot has already been booked.");

    public static Error SlotOutsideAvailability => Error.Validation(
        code: "Availability.SlotOutsideAvailability",
        description: "The requested slot is outside the doctor's available hours.");

    public static Error EndBeforeStart => Error.Validation(
        code: "Availability.EndBeforeStart",
        description: "End time must be after start time.");

    public static Error InvalidSlotDuration => Error.Validation(
        code: "Availability.InvalidSlotDuration",
        description: "Slot duration must be between 15 and 120 minutes.");

    public static Error WindowTooShort => Error.Validation(
        code: "Availability.WindowTooShort",
        description: "The availability window is too short to fit even one slot of the given duration.");

    public static Error CannotUpdateWithBookedSlots => Error.Conflict(
        code: "Availability.CannotUpdateWithBookedSlots",
        description: "Cannot update availability because one or more slots are already booked.");

    public static Error CannotDeleteWithBookedSlots => Error.Conflict(
        code: "Availability.CannotDeleteWithBookedSlots",
        description: "Cannot delete availability because one or more slots are already booked.");

    public static Error DuplicateDate => Error.Conflict(
        code: "Availability.DuplicateDate",
        description: "Availability for this date already exists. Update the existing one instead.");

    public static Error CannotCreateInPast => Error.Validation(
        code: "Availability.CannotCreateInPast",
        description: "Cannot create availability for a past date.");

    public static Error CannotModifyPast => Error.Validation(
        code: "Availability.CannotModifyPast",
        description: "Cannot modify or delete availability for a past date.");

    public static Error SlotBelongsToDifferentDoctor => Error.Forbidden(
        code: "Availability.SlotBelongsToDifferentDoctor",
        description: "This slot does not belong to the specified doctor.");
}
