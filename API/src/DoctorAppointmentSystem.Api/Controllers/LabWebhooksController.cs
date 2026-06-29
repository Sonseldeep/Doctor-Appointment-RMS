using System.Text.Json;
using DoctorAppointmentSystem.Api.Common.Authentication;
using DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

// 1. API-Specific DTO to handle multipart/form-data routing
public class LabIngestionRequest
{
    public string LabName { get; set; } = string.Empty;
    public string PatientEmail { get; set; } = string.Empty;
    public string PanelName { get; set; } = string.Empty;
    public DateTime ObservationDate { get; set; }
    
    // In multipart forms, complex arrays (like lists of observations) 
    // are easiest to transmit as a serialized JSON string field.
    public string ObservationsJson { get; set; } = string.Empty; 

    public IFormFile? Document { get; set; }
}

[ApiController]
[Route("api/webhooks/labs")]
public class LabWebhooksController : ApiController // Inheriting your existing base class
{
    private readonly ISender _sender; 

    // Replaced Hangfire with MediatR's ISender
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
        // 2. Safely deserialize the array of observations from the form text
        var observations = string.IsNullOrWhiteSpace(request.ObservationsJson) 
            ? new List<ObservationDto>() 
            : JsonSerializer.Deserialize<List<ObservationDto>>(request.ObservationsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        Console.WriteLine($"ObservationsJson: {request.ObservationsJson}");
        Console.WriteLine($"Observation Count: {observations?.Count ?? 0}");

                // 3. Map the ASP.NET Core IFormFile to our architecture-safe Application FileDto
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

        // 4. Construct the Command we built in Phase 2
        var command = new ReceiveLabPayloadCommand(
            request.LabName,
            request.PatientEmail,
            request.PanelName,
            request.ObservationDate,
            observations!,
            fileDto
        );

        // 5. Execute synchronously to ensure the stream stays alive during Cloudinary upload
        var result = await _sender.Send(command, cancellationToken);

        if (result.IsError)
        {
            // Leverages your ErrorOr implementation to return a proper 400 series error
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