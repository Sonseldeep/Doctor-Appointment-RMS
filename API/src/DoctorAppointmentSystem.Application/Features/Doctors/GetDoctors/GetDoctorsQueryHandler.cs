using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

internal sealed class GetDoctorsQueryHandler
    : IQueryHandler<GetDoctorsQuery, IReadOnlyList<DoctorResponse>>
{
    private readonly IDoctorProfileRepository _repo;

    public GetDoctorsQueryHandler(IDoctorProfileRepository repo)
    {
        _repo = repo;
    }

    public async Task<ErrorOr<IReadOnlyList<DoctorResponse>>> Handle(GetDoctorsQuery request, CancellationToken cancellationToken)
    {
        var doctors = await _repo.GetActiveWithUserAsync(cancellationToken);

        var response = doctors
            .Select(d => new DoctorResponse(
                DoctorProfileId: d.Id,
                UserId: d.UserId,
                FirstName: d.User.FirstName,
                LastName: d.User.LastName,
                ProfilePhotoUrl: d.User.ProfilePhotoUrl,
                Specialization: d.Specialization,
                ConsultationFee: d.ConsultationFee,
                Bio: d.Bio))
            .ToList()
            .AsReadOnly();

        return response;
    }
}