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

    public static Error NotApproved => Error.Forbidden(
        code: "DoctorProfile.NotApproved",
        description: "Doctor is not approved by admin.");
    
    public static Error ProfileMissing => Error.NotFound(
        code: "DoctorProfile.ProfileMissing",
        description: "Doctor profile does not exist.");
    
    
    public static Error AlreadyApproved => Error.Conflict(
        code: "DoctorProfile.AlreadyApproved",
        description: "Doctor is already approved and active.");

    public static Error AlreadySuspended => Error.Conflict(
        code: "DoctorProfile.AlreadySuspended",
        description: "Doctor is already suspended.");
    
    
    

}