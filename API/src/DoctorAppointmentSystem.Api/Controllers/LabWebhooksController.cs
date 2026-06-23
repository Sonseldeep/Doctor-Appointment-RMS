using DoctorAppointmentSystem.Api.Common.Authentication;
using DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[ApiController]
[Route("api/webhooks/labs")]
public class LabWebhooksController : ApiController
{
    private readonly IBackgroundJobClient _backgroundJobClient;

    public LabWebhooksController(IBackgroundJobClient backgroundJobClient)
    {
        _backgroundJobClient = backgroundJobClient;
    }

    [HttpPost("ingest")]
    [ApiKey] // Enforces secure server-to-server connection
    public IActionResult IngestLabResults([FromBody] ReceiveLabPayloadCommand command)
    {
        // Enqueues off-thread instantly via Hangfire to minimize request overhead
        _backgroundJobClient.Enqueue<ISender>(sender => sender.Send(command, CancellationToken.None));
        return Accepted(new { Message = "Payload transferred to internal processing pipeline engine." });
    }
}