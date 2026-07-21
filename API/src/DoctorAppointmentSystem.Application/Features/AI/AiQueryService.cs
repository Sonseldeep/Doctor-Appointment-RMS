using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Embeddings;
using Microsoft.Extensions.Logging;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.AI;
using Microsoft.SemanticKernel.ChatCompletion;

namespace DoctorAppointmentSystem.Application.Features.AI;

public class AiQueryService
{
    private readonly Kernel _kernel;
    private readonly IVectorDatabase _vectorDb;
    private readonly IUserContext _userContext;
    private readonly ILogger<AiQueryService> _logger;
    private readonly IChatCompletionService _chatCompletionService;

    public AiQueryService(Kernel kernel, IChatCompletionService chatCompletionService, IVectorDatabase vectorDb, IUserContext userContext, ILogger<AiQueryService> logger)
    {
        _kernel = kernel;
        _chatCompletionService = chatCompletionService;
        _vectorDb = vectorDb;
        _userContext = userContext;
        _logger = logger;
    }

    public async Task<string> AskQuestionAsync(Guid targetPatientId, string userQuestion, CancellationToken ct)
    {
        if (_userContext.Role == "Registered" && _userContext.PatientProfileId != targetPatientId)
        {
            throw new UnauthorizedAccessException();
        }
        var records = await _vectorDb.GetAllPatientTextRecordsAsync(targetPatientId, ct);

        string contextText = records != null && records.Any()
            ? string.Join("\n\n--- Historical Record Split ---\n\n", records)
            : "No lab reports or medical historical documentation found for this patient.";

        string systemPrompt = _userContext.Role == "Doctor"
    ? @"You are an expert Clinical Decision Support AI and diagnostician. You have access to the patient's chronological medical history.

RESPONSE BEHAVIOR:
- If the user sends a simple greeting (like 'Hi') or asks a specific, narrow question (like 'What is the WBC count?'): Respond directly, naturally, and concisely to their input. Do NOT generate the massive structural report.
- If the user asks for a general summary, full analysis, trends, or an overview: You MUST structure your analysis using exactly these Markdown headers:
  - **Timeline Analysis**
  - **Executive Summary**
  - **Longitudinal Trend Analysis**
  - **Clinical Considerations**

FORMATTING & MEDICAL NOTATION STANDARDS (CRITICAL):
- DO NOT use LaTeX math formatting, backslashes, or dollar signs ($).
- Format all lab values, reference ranges, and units using standard plain-text clinical notation readable in Electronic Health Records (EHRs).
- Write numbers and units cleanly: e.g., '111 x 10^3 /µL' or '111,000 /µL', '15.5 g/dL'.
- Write ranges cleanly: e.g., '(Reference Range: 4.5 – 11.0 x 10^3 /µL)' or '(Ref: 4.5-11.0 K/µL)'.
- Never use LaTeX commands like \times, \mu, \text{}, \frac{}, or enclose text inside $ ... $.

CRITICAL TIME-SERIES INSTRUCTIONS (Apply when analyzing data):
1. Strict Chronology: Determine the order of lab reports based solely on exact observation dates and times.
2. Zero Assumptions: Do not assume a patient always progresses from normal to abnormal. Do not let clinical intuition override timestamps.
3. Show Your Work: If providing a full analysis, explicitly state the timeline first.

Use precise medical terminology and maintain a professional tone."
    : "You are an empathetic medical assistant. Review the provided baseline history records and explain what the over-time trends mean for the patient using clear, simple terms without heavy medical jargon. Reassure them on improvements and highlight items needing focus.";
        var promptTemplate = systemPrompt + "\n\nLONGITUDINAL PATIENT HISTORY:\n{{$context}}\n\nCURRENT INQUIRY: {{$question}}";

        var arguments = new KernelArguments
        {
            ["context"] = contextText,
            ["question"] = userQuestion
        };

        var result = await _kernel.InvokePromptAsync(promptTemplate, arguments, cancellationToken: ct);
        return result.ToString();
    }
}