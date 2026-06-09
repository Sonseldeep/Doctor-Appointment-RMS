using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;

internal sealed class GetAllDoctorsQueryHandler
    : IQueryHandler<GetAllDoctorsQuery, PagedResult<AdminDoctorResponse>>
{
    private readonly IDoctorProfileRepository _doctorProfiles;

    public GetAllDoctorsQueryHandler(IDoctorProfileRepository doctorProfiles)
    {
        _doctorProfiles = doctorProfiles;
    }

    public async Task<ErrorOr<PagedResult<AdminDoctorResponse>>> Handle(
        GetAllDoctorsQuery request,
        CancellationToken cancellationToken)
    {
        return await _doctorProfiles.GetAllPagedAsync(request, cancellationToken);

    }
}