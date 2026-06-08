using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Doctor;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.SuspendDoctor;

internal sealed class SuspendDoctorCommandHandler : ICommandHandler<SuspendDoctorCommand>
{
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IUnitOfWork _uow;

    public SuspendDoctorCommandHandler(
        IDoctorProfileRepository doctorProfiles,
        IUnitOfWork uow)
    {
        _doctorProfiles = doctorProfiles;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(
        SuspendDoctorCommand request,
        CancellationToken cancellationToken)
    {
        var profile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        if (profile is null)
            return DoctorErrors.ProfileMissing;

        profile.Suspend();
        await _uow.SaveChangesAsync(cancellationToken);
        return Result.Success;
    }
}