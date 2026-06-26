using DoctorAppointmentSystem.Application.Features.Doctors.Patients.GetPatientRecords;
using DoctorAppointmentSystem.Application.Features.Doctors.Patients.SearchPatients;
using MediatR; // 1. Added MediatR namespace
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Authorize(Roles = "Doctor")]
[Route("api/doctor/patients")]
public class DoctorPatientsController : ApiController
{
    // 2. Add a private field for the sender
    private readonly ISender _sender;

    // 3. Inject ISender via the constructor
    public DoctorPatientsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchPatients([FromQuery] string q)
    {
        var query = new SearchPatientsQuery(q);

        // 4. Use _sender instead of Sender
        var result = await _sender.Send(query);

        return result.Match(
            patients => Ok(patients),
            errors => Problem(errors.ToString())
        );
    }

    [HttpGet("{patientId:guid}/lab-reports")]
    public async Task<IActionResult> GetPatientLabReports(Guid patientId)
    {
        var query = new GetPatientRecordsForDoctorQuery(patientId);

        // 5. Use _sender instead of Sender
        var result = await _sender.Send(query);

        return result.Match(
            reports => Ok(reports),
            errors => Problem(errors.ToString())
        );
    }
}