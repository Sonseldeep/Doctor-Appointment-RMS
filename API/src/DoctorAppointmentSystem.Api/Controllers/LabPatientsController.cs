using DoctorAppointmentSystem.Application.Features.Labs.SearchPatients;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[ApiController]
[Authorize(Roles = "LabTechnician")]
[Route("api/lab-technicians/patients")]
public class LabPatientsController : ApiController
{
    private readonly ISender _sender;

    public LabPatientsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchPatients([FromQuery] string q, CancellationToken cancellationToken)
    {
        var query = new SearchLabPatientsQuery(q);

        var result = await _sender.Send(query, cancellationToken);

        return result.Match(Ok, Problem);
    }
}