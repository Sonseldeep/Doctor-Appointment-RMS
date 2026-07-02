using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Patients.SearchPatients;

public record SearchPatientsQuery(string SearchTerm) : IQuery<List<PatientSearchResponse>>;

public class SearchPatientsQueryHandler : IQueryHandler<SearchPatientsQuery, List<PatientSearchResponse>>
{
    private readonly IPatientProfileRepository _patientRepository;
    private readonly IUserContext _userContext;

    public SearchPatientsQueryHandler(IPatientProfileRepository patientRepository, IUserContext userContext)
    {
        _patientRepository = patientRepository;
        _userContext = userContext;
    }

    public async Task<ErrorOr<List<PatientSearchResponse>>> Handle(SearchPatientsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SearchTerm) || request.SearchTerm.Length < 2)
        {
            return new List<PatientSearchResponse>();
        }

        var results = await _patientRepository.SearchByNameOrEmailAsync(_userContext.UserId,request.SearchTerm, cancellationToken);

        return results
            .Select(item => new PatientSearchResponse(
            item.Patient.UserId,
            $"{item.User.FirstName} {item.User.LastName}", 
            item.User.Email,                         
            item.Patient.DateOfBirth.ToDateTime(TimeOnly.MinValue)
        )).ToList();
    }
}