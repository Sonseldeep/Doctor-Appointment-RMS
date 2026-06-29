using System.Text.Json;
using DoctorAppointmentSystem.Api.Common.Authentication;
using DoctorAppointmentSystem.Api.Common.Request;
using DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;


[ApiController]
[Route("api/webhooks/labs")]
public class LabWebhooksController : ApiController
{
    private readonly ISender _sender; 

    public LabWebhooksController(ISender sender) 
    {
        _sender = sender;
    }

    [HttpPost("ingest")]
    [ApiKey] 
    public async Task<IActionResult> IngestLabResults(
        [FromForm] LabIngestionRequest request, 
        CancellationToken cancellationToken)
    {
        var observations = string.IsNullOrWhiteSpace(request.ObservationsJson) 
            ? []
            : JsonSerializer.Deserialize<List<ObservationDto>>(request.ObservationsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        

                FileDto? fileDto = null;
        if (request.Document is not null && request.Document.Length > 0)
        {
            fileDto = new FileDto(
                request.Document.OpenReadStream(),
                request.Document.FileName,
                request.Document.ContentType,
                request.Document.Length
            );
        }

        var command = new ReceiveLabPayloadCommand(
            request.LabName,
            request.PatientEmail,
            request.PanelName,
            request.ObservationDate,
            observations!,
            fileDto
        );

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsError)
        {
            return BadRequest(result.Errors); 
        }

        return Ok(new { Message = "Payload and attached documents successfully processed and secured." });
    }

    [HttpGet("verify-key")]
    [ApiKey] // Reuses your standard header token evaluation rules
    public IActionResult VerifyKey()
    {
        // If the ApiKey attribute passes, return a lightweight 200 OK
        return Ok(new { Valid = true, Message = "Access key verified." });
    }
}