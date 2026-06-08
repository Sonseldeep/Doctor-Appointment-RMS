using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;

internal sealed class GetAllDoctorsQueryHandler
    : IQueryHandler<GetAllDoctorsQuery, IReadOnlyList<AdminDoctorResponse>>
{
    private readonly IDoctorProfileRepository _doctorProfiles;

    public GetAllDoctorsQueryHandler(IDoctorProfileRepository doctorProfiles)
    {
        _doctorProfiles = doctorProfiles;
    }

    public async Task<ErrorOr<IReadOnlyList<AdminDoctorResponse>>> Handle(
        GetAllDoctorsQuery request,
        CancellationToken cancellationToken)
    {
        var doctors = await _doctorProfiles.GetAllWithUserAsync(cancellationToken);

        var result = doctors
            .Select(d => new AdminDoctorResponse(
                UserId: d.UserId,
                DoctorProfileId: d.Id,
                FirstName: d.User.FirstName,
                LastName: d.User.LastName,
                Email: d.User.Email,
                ProfilePhotoUrl: d.User.ProfilePhotoUrl,
                Specialization: d.Specialization,
                ConsultationFee: d.ConsultationFee,
                Status: d.Status,
                Bio: d.Bio,
                CreatedAtUtc: d.CreatedAtUtc))
            .ToList()
            .AsReadOnly();

        return result;
    }
}