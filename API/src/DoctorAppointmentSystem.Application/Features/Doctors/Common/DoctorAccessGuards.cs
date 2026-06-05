using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Common;

internal static class DoctorAccessGuards
{
    // doctor-only actions (confirm/complete)
    public static ErrorOr<Success> EnsureApprovedForDoctorActions(User user, DoctorProfile? profile)
    {
        if (user.Role != UserRole.Doctor)
        {
            return DoctorErrors.UserIsNotDoctor;
        }


        if (profile is null)
        {
            return DoctorErrors.ProfileMissing;

        }

        if (profile.Status != DoctorStatus.Active)
        {
            return DoctorErrors.NotApproved;

        }

        return Result.Success;
    }
    
    public static ErrorOr<Success> EnsureApprovedForPublicView(User user, DoctorProfile? profile)
    {
        if (user.Role != UserRole.Doctor || profile is null || profile.Status != DoctorStatus.Active)
        {
            return DoctorErrors.NotFound;
        }

        return Result.Success;
    }
}