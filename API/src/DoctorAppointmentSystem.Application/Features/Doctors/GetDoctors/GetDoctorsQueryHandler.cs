using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

internal sealed class GetDoctorsQueryHandler
    : IQueryHandler<GetDoctorsQuery, PagedResult<DoctorResponse>>
{
    private readonly IDoctorProfileRepository _repo;

    public GetDoctorsQueryHandler(IDoctorProfileRepository repo)
    {
        _repo = repo;
    }

    public async Task<ErrorOr<PagedResult<DoctorResponse>>> Handle(GetDoctorsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetActivePagedAsync(request, cancellationToken);

    }
}