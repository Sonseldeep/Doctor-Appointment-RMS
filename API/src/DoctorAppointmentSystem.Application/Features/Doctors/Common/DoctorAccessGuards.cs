using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Common;

internal static class DoctorAccessGuards
{
    public static ErrorOr<Success> EnsureApprovedDoctor(User user, DoctorProfile? profile)
    {
        if (user.Role != UserRole.Doctor)
        {
            return Error.Forbidden("Doctor.Forbidden", "User is not a doctor.");
        }


        if (profile is null)
        {
            return Error.Forbidden("Doctor.ProfileMissing", "Doctor profile is missing.");

        }

        if (profile.Status != DoctorStatus.Active)
        {
            return Error.Forbidden("Doctor.NotApproved", "Doctor is not approved by admin.");

        }

        return Result.Success;
    }
}