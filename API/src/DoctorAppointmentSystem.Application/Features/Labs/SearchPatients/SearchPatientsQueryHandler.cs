using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Labs.SearchPatients;

public sealed class SearchLabPatientsQueryHandler
    : IQueryHandler<SearchLabPatientsQuery, List<LabPatientSearchResponse>>
{
    private const int MinSearchTermLength = 1;

    private readonly IPatientProfileRepository _patientRepository;

    public SearchLabPatientsQueryHandler(IPatientProfileRepository patientRepository)
    {
        _patientRepository = patientRepository;
    }

    public async Task<ErrorOr<List<LabPatientSearchResponse>>> Handle(
        SearchLabPatientsQuery request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SearchTerm) || request.SearchTerm.Trim().Length < MinSearchTermLength)
        {
            return new List<LabPatientSearchResponse>();
        }

        var results = await _patientRepository.SearchForLabAsync(request.SearchTerm.Trim(), cancellationToken);

        return results
            .Select(item => new LabPatientSearchResponse(
                item.Patient.UserId,
                item.User.FirstName,
                item.User.LastName,
                item.User.Email,
                item.User.ProfilePhotoUrl,
                item.Patient.DateOfBirth.ToDateTime(TimeOnly.MinValue)))
            .ToList();
    }
}