using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorByUserId;

internal sealed class GetDoctorByUserIdQueryHandler
    : IQueryHandler<GetDoctorByUserIdQuery, DoctorDetailsResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IDoctorProfileRepository _doctorProfileRepository;

    public GetDoctorByUserIdQueryHandler(
        IUserRepository userRepository,
        IDoctorProfileRepository doctorProfileRepository)
    {
        _userRepository = userRepository;
        _doctorProfileRepository = doctorProfileRepository;
    }

    public async Task<ErrorOr<DoctorDetailsResponse>> Handle(GetDoctorByUserIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return DoctorErrors.NotFound;

        }
        
        var profile = await _doctorProfileRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        var access = DoctorAccessGuards.EnsureApprovedForPublicView(user, profile);

        if (access.IsError)
        {
            return access.Errors;
        }
        

        var response = new DoctorDetailsResponse(
            DoctorProfileId: profile!.Id,
            UserId: user.Id,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Role: user.Role.ToString(),
            ProfilePhotoUrl: user.ProfilePhotoUrl,
            Specialization: profile.Specialization,
            ConsultationFee: profile.ConsultationFee,
            Status: profile.Status,
            Bio: profile.Bio);

        return response;
    }
}