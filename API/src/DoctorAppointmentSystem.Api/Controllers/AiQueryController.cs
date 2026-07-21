using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DoctorAppointmentSystem.Application.Features.AI;

namespace DoctorAppointmentSystem.API.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]
    public class AiQueryController : ControllerBase
    {
        private readonly AiQueryService _aiQueryService;

        public AiQueryController(AiQueryService aiQueryService)
        {
            _aiQueryService = aiQueryService;
        }

        public record AskAiRequest(string Question);

        [HttpPost("patients/{patientId:guid}/ask")]
        public async Task<IActionResult> AskPatientData(Guid patientId, [FromBody] AskAiRequest request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
            {
                return BadRequest("Question cannot be empty.");
            }

            try
            {
                var answer = await _aiQueryService.AskQuestionAsync(patientId, request.Question, ct);
                return Ok(new { Answer = answer });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}