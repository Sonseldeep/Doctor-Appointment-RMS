using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Application.Common;

namespace DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;

internal sealed class GetAllPatientsQueryHandler
    : IQueryHandler<GetAllPatientsQuery, PagedResult<AdminPatientResponse>>
{
    private readonly IPatientProfileRepository _patients;

    public GetAllPatientsQueryHandler(IPatientProfileRepository patients)
    {
        _patients = patients;
    }

    public async Task<ErrorOr.ErrorOr<PagedResult<AdminPatientResponse>>> Handle(
        GetAllPatientsQuery request,
        CancellationToken cancellationToken)
    {
        var result = await _patients.GetPagedWithUserAsync(request, cancellationToken);
        return result;
    }
}