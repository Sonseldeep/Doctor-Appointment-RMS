using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Patients.UpdatePatientProfile;


internal sealed class UpdatePatientProfileCommandHandler
    : ICommandHandler<UpdatePatientProfileCommand>
{
    private readonly IUserRepository _users;
    private readonly IPatientProfileRepository _patients;
    private readonly IUnitOfWork _uow;

    public UpdatePatientProfileCommandHandler(
        IUserRepository users,
        IPatientProfileRepository patients,
        IUnitOfWork uow)
    {
        _users = users;
        _patients = patients;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(UpdatePatientProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }

        if (user.Role != UserRole.Registered)
        {
            return PatientErrors.UserIsNotPatient;
        }

        var profile = await _patients.GetByUserIdAsync(request.UserId, cancellationToken);
        if (profile is null)
        {
            return PatientErrors.ProfileNotFound;
        }

        profile.Update(request.PhoneNumber, request.Address, request.Sex, request.DateOfBirth);

        await _uow.SaveChangesAsync(cancellationToken);
        return Result.Success;
    }
}