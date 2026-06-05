using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.SuspendDoctor;

internal sealed class SuspendDoctorCommandHandler : ICommandHandler<SuspendDoctorCommand>
{
    private readonly IUserRepository _users;
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IUnitOfWork _uow;

    public SuspendDoctorCommandHandler(
        IUserRepository users,
        IDoctorProfileRepository doctorProfiles,
        IUnitOfWork uow)
    {
        _users = users;
        _doctorProfiles = doctorProfiles;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(SuspendDoctorCommand request, CancellationToken cancellationToken)
    {
        var admin = await _users.GetByIdAsync(request.AdminUserId, cancellationToken);
        
        if (admin is null)
        {
            return UserErrors.NotFound;
        }
        
        if (admin.Role != UserRole.Admin)
        {
            return Error.Forbidden("Admin.Forbidden", "Admin access required.");
        }
        
        var doctorUser = await _users.GetByIdAsync(request.DoctorUserId, cancellationToken);
        
        if (doctorUser is null)
        {
            return UserErrors.NotFound;
        }
        
        if (doctorUser.Role != UserRole.Doctor)
        {
            return Error.Validation("Doctor.NotDoctor", "Target user is not a doctor.");
        }

        var profile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        
        if (profile is null)
        {
            return Error.NotFound("DoctorProfile.NotFound", "Doctor profile not found.");
        }

        profile.Suspend();
        
        // revoke doctor tokens immediately
        doctorUser.RotateTokenVersion();

        await _uow.SaveChangesAsync(cancellationToken);
        return Result.Success;
    }
}