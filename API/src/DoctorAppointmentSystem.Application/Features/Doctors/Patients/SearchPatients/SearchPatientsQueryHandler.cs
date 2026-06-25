using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Patients.SearchPatients;

public record SearchPatientsQuery(string SearchTerm) : IQuery<List<PatientSearchResponse>>;

public class SearchPatientsQueryHandler : IQueryHandler<SearchPatientsQuery, List<PatientSearchResponse>>
{
    private readonly IPatientProfileRepository _patientRepository;

    public SearchPatientsQueryHandler(IPatientProfileRepository patientRepository)
    {
        _patientRepository = patientRepository;
    }

    public async Task<ErrorOr<List<PatientSearchResponse>>> Handle(SearchPatientsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SearchTerm) || request.SearchTerm.Length < 2)
        {
            return new List<PatientSearchResponse>();
        }

        // Now we get back a list of tuples containing both entities
        var results = await _patientRepository.SearchByNameOrEmailAsync(request.SearchTerm, cancellationToken);

        return results.Select(item => new PatientSearchResponse(
            item.Patient.UserId,
            $"{item.User.FirstName} {item.User.LastName}", // Access via the joined User
            item.User.Email,                              // Access via the joined User
            item.Patient.DateOfBirth.ToDateTime(TimeOnly.MinValue)
        )).ToList();
    }
}