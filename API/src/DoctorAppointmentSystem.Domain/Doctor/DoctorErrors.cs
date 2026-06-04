using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Doctor;

public static class DoctorErrors
{
    public static Error NotFound => Error.NotFound(
        code: "DoctorProfile.NotFound",
        description: "DoctorProfile profile was not found.");

    public static Error AlreadyExists => Error.Conflict(
        code: "DoctorProfile.AlreadyExists",
        description: "DoctorProfile profile already exists for this user.");

    public static Error UserIsNotDoctor => Error.Validation(
        code: "DoctorProfile.UserIsNotDoctor",
        description: "This user is not a doctor.");

    public static Error Inactive => Error.Validation(
        code: "DoctorProfile.Inactive",
        description: "DoctorProfile profile is inactive.");
}