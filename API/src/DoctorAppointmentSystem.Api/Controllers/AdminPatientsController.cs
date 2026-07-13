using DoctorAppointmentSystem.Application.Features.Admin.Patient.Contracts;
using DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;
using DoctorAppointmentSystem.Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/admin/patients")]
[Authorize(Roles = nameof(UserRole.Admin))]
public sealed class AdminPatientsController : ApiController
{
    private readonly ISender _sender;

    public AdminPatientsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetAllPatientsRequest request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(request.ToQuery(), cancellationToken);
        return result.Match(Ok, Problem);
    }
}
