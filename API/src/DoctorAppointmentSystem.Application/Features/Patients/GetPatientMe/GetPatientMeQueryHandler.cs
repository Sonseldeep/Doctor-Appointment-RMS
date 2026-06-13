using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Patients.GetPatientMe;

internal sealed class GetPatientMeQueryHandler
    : IQueryHandler<GetPatientMeQuery, PatientMeResponse>
{
    private readonly IUserRepository _users;
    private readonly IPatientProfileRepository _patients;

    public GetPatientMeQueryHandler(IUserRepository users, IPatientProfileRepository patients)
    {
        _users = users;
        _patients = patients;
    }

    public async Task<ErrorOr<PatientMeResponse>> Handle(GetPatientMeQuery request, CancellationToken cancellationToken)
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

        return new PatientMeResponse(
            UserId: user.Id,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Role: user.Role.ToString(),
            ProfilePhotoUrl: user.ProfilePhotoUrl,
            Sex: profile.Sex,
            PhoneNumber: profile.PhoneNumber,
            Address: profile.Address);
    }
}