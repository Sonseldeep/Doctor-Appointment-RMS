using DoctorAppointmentSystem.Application.Features.Doctors.Patients.GetPatientRecords;
using DoctorAppointmentSystem.Application.Features.Doctors.Patients.SearchPatients;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Authorize(Roles = "Doctor")]
[Route("api/doctor/patients")]
public class DoctorPatientsController : ApiController
{
    private readonly ISender _sender;

    public DoctorPatientsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchPatients([FromQuery] string q)
    {
        var query = new SearchPatientsQuery(q);

        var result = await _sender.Send(query);

        return result.Match(
            Ok,
            errors => Problem(errors.ToString())
        );
    }

    [HttpGet("{patientId:guid}/lab-reports")]
    public async Task<IActionResult> GetPatientLabReports(Guid patientId)
    {
        var query = new GetPatientRecordsForDoctorQuery(patientId);

        var result = await _sender.Send(query);

        return result.Match(
            Ok,
            errors => Problem(errors.ToString())
        );
    }
}