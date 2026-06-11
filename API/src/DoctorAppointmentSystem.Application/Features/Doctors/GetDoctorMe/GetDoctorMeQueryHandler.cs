using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Contract;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorMe;

internal sealed class GetDoctorMeQueryHandler
    : IQueryHandler<GetDoctorMeQuery, DoctorDetailsResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IDoctorProfileRepository _doctorProfileRepository;

    public GetDoctorMeQueryHandler(
        IUserRepository userRepository,
        IDoctorProfileRepository doctorProfileRepository)
    {
        _userRepository = userRepository;
        _doctorProfileRepository = doctorProfileRepository;
    }

    public async Task<ErrorOr<DoctorDetailsResponse>> Handle(GetDoctorMeQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }

        if (user.Role != UserRole.Doctor)
        {
            return DoctorErrors.UserIsNotDoctor;
        }

        var profile = await _doctorProfileRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (profile is null)
        {
            return DoctorErrors.NotFound;
        }

        var response = new DoctorDetailsResponse(
            DoctorProfileId: profile.Id,
            UserId: user.Id,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Role: user.Role.ToString(),
            ProfilePhotoUrl: user.ProfilePhotoUrl,
            NmcNumber: profile.NmcNumber,
            Specialization: profile.Specialization,
            ConsultationFee: profile.ConsultationFee,
            Status: profile.Status,
            Bio: profile.Bio);

        return response;
    }
}