using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Patients;


public static class PatientErrors
{
    public static Error ProfileNotFound => Error.NotFound(
        code: "PatientProfile.NotFound",
        description: "Patient profile was not found.");

    public static Error UserIsNotPatient => Error.Validation(
        code: "PatientProfile.UserIsNotPatient",
        description: "This user is not a patient (Registered).");
}