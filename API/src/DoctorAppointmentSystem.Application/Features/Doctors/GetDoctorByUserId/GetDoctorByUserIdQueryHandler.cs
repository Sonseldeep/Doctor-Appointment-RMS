using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Ratings;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Application.Features.Doctors.Contract;
using DoctorAppointmentSystem.Domain.Doctor;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorByUserId;

internal sealed class GetDoctorByUserIdQueryHandler
    : IQueryHandler<GetDoctorByUserIdQuery, DoctorDetailsResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IDoctorProfileRepository _doctorProfileRepository;
    private readonly IRatingSummaryRepository _ratingSummaries;


    public GetDoctorByUserIdQueryHandler(
        IUserRepository userRepository,
        IDoctorProfileRepository doctorProfileRepository,
        IRatingSummaryRepository ratingSummaries)
    {
        _userRepository = userRepository;
        _doctorProfileRepository = doctorProfileRepository;
        _ratingSummaries = ratingSummaries;
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
        
        var summary = await _ratingSummaries.GetByDoctorUserIdAsync(request.UserId, cancellationToken);


        var response = new DoctorDetailsResponse(
            DoctorProfileId: profile!.Id,
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
            Bio: profile.Bio,
            AverageRating: summary?.AverageRating ?? 0m,
            TotalRatings: summary?.TotalRatings ?? 0);

        return response;
    }
}