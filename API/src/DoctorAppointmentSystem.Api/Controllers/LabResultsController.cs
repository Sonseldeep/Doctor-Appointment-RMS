using System.Text.Json;
using DoctorAppointmentSystem.Api.Common.Request;
using DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;
using DoctorAppointmentSystem.Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[ApiController]
[Route("api/lab-technicians/lab-results")]
[Authorize(Roles = nameof(UserRole.LabTechnician))]
public class LabResultsController : ApiController
{
    private static readonly JsonSerializerOptions ObservationsJsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly ISender _sender;

    public LabResultsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("ingest")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> IngestLabResults(
        [FromForm] LabResultRequest request,
        CancellationToken cancellationToken)
    {
        var observations = ParseObservations(request.ObservationsJson);
        var document = ToFileDto(request.Document);

        var command = new ReceiveLabPayloadCommand(
            request.LabName,
            request.PatientEmail,
            request.PanelName,
            request.ObservationDate,
            observations,
            document);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(_ => Ok(), Problem);
    }

    private static List<ObservationDto> ParseObservations(string? observationsJson)
    {
        if (string.IsNullOrWhiteSpace(observationsJson))
        {
            return [];
        }

        return JsonSerializer.Deserialize<List<ObservationDto>>(observationsJson, ObservationsJsonOptions) ?? [];
    }

    private static FileDto? ToFileDto(IFormFile? file)
    {
        if (file is null || file.Length == 0)
        {
            return null;
        }

        return new FileDto(
            file.OpenReadStream(),
            file.FileName,
            file.ContentType,
            file.Length);
    }
}
