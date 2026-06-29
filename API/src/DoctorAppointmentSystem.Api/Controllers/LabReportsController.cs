using DoctorAppointmentSystem.Application.Features.Labs.ExportLabReport;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/lab-reports")]
[Authorize]
public sealed class LabReportsController : ApiController
{
    private readonly ISender _sender;

    public LabReportsController(ISender sender)
    {
        _sender = sender;
    }


    [HttpGet]
    public async Task<IActionResult> GetMyReports(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(new GetLabReportsQuery(userId), cancellationToken);

        return result.Match(Ok, Problem);
    }

    [HttpGet("{id}/export")]
    public async Task<IActionResult> ExportLabReport(Guid id, [FromServices] ISender sender)
    {
        var query = new ExportLabReportQuery(id);
        var result = await sender.Send(query);

        return result.Match(
            pdfBytes => File(pdfBytes, "application/pdf", $"MedicalReport_{id}.pdf"),
            Problem
        );
    }
}