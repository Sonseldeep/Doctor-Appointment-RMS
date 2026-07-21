using System.Text.Json;
using DoctorAppointmentSystem.Api.Common.Request;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabTechnicianSendHistory;
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
    public async Task<IActionResult> IngestLabResults([FromForm] LabResultRequest request, CancellationToken cancellationToken)
    {
        var observations = ParseObservations(request.ObservationsJson);
        var documents = ToFileDtos(request.Documents);

        var command = new ReceiveLabPayloadCommand(
            request.LabName,
            request.PatientEmail,
            request.PanelName,
            request.ObservationDate,
            observations,
            documents);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(_ => Ok(), Problem);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetSendHistory(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var labTechnicianId))
        {
            return Unauthorized();
        }

        var query = new GetLabTechnicianSendHistoryQuery(labTechnicianId);

        var result = await _sender.Send(query, cancellationToken);

        return result.Match(Ok, Problem);
    }

    private static List<ObservationDto> ParseObservations(string? observationsJson)
    {
        if (string.IsNullOrWhiteSpace(observationsJson))
        {
            return [];
        }

        return JsonSerializer.Deserialize<List<ObservationDto>>(observationsJson, ObservationsJsonOptions) ?? [];
    }

    private static List<FileDto>? ToFileDtos(List<IFormFile>? files)
    {
        if (files is null or { Count: 0 })
        {
            return null;
        }

        return files
            .Where(f => f.Length > 0)
            .Select(f => new FileDto(f.OpenReadStream(), f.FileName, f.ContentType, f.Length))
            .ToList();
    }
}
