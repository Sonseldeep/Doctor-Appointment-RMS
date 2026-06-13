using ErrorOr;

namespace DoctorAppointmentSystem.Domain.ClinicalNotes;

public static class ClinicalNoteErrors
{
    public static Error NotFound => Error.NotFound(
        code: "ClinicalNote.NotFound",
        description: "Clinical note not found.");

    public static Error Forbidden => Error.Forbidden(
        code: "ClinicalNote.Forbidden",
        description: "You are not allowed to perform this operation.");

    public static Error AlreadyExists => Error.Conflict(
        code: "ClinicalNote.AlreadyExists",
        description: "A clinical note already exists for this appointment.");

    public static Error AppointmentNotCompleted => Error.Validation(
        code: "ClinicalNote.AppointmentNotCompleted",
        description: "Clinical notes can only be added for confirmed or completed appointments.");
}