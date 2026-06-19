using DoctorAppointmentSystem.Application.Features.ClinicalNotes.AddClinicalNote;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.ExportClinicalNotes;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.ExportClinicalNotes;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetClinicalNoteByAppointment;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetMyClinicalNotes;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetUpcomingFollowUps;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.UpdateClinicalNote;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/clinical-notes")]
[Authorize]
public sealed class ClinicalNotesController : ApiController
{
    private readonly ISender _sender;

    public ClinicalNotesController(ISender sender)
    {
        _sender = sender;
    }

   
    [HttpPost]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Add([FromBody] AddClinicalNoteRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }

        var command = new AddClinicalNoteCommand(
            doctorUserId,
            request.AppointmentId,
            request.Diagnosis,
            request.Observations,
            request.TreatmentSummary,
            request.FollowUpDate,
            request.FollowUpInstructions,
            request.Medications);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(Ok, Problem);
    }

    [HttpPut("{clinicalNoteId:guid}")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> Update(
        Guid clinicalNoteId,
        [FromBody] UpdateClinicalNoteRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var doctorUserId))
        {
            return Unauthorized();
        }

        var command = new UpdateClinicalNoteCommand(
            doctorUserId,
            clinicalNoteId,
            request.Diagnosis,
            request.Observations,
            request.TreatmentSummary,
            request.FollowUpDate,
            request.FollowUpInstructions,
            request.Medications);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(Ok, Problem);
    }


    [HttpGet("appointment/{appointmentId:guid}")]
    public async Task<IActionResult> GetByAppointment(Guid appointmentId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new GetClinicalNoteByAppointmentQuery(userId, appointmentId),
            cancellationToken);

        return result.Match(Ok, Problem);
    }


    [HttpGet("me")]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var result = await _sender.Send(new GetMyClinicalNotesQuery(userId), cancellationToken);

        return result.Match(Ok, Problem);
    }

    [HttpGet("appointment/{appointmentId:guid}/export-pdf")]
    [Authorize]
    public async Task<IActionResult> ExportPdf(Guid appointmentId, CancellationToken cancellationToken)
    {
        // Send the specific appointmentId down to the handler
        var result = await _sender.Send(new ExportClinicalNotesQuery(appointmentId), cancellationToken);

        return result.Match<IActionResult>(
            pdfData => File(pdfData, "application/pdf", $"Prescription_{appointmentId}_{DateTime.UtcNow:yyyyMMdd}.pdf"),
            errors => Problem(errors.First().Description)
        );
    }

    [HttpGet("upcoming-followups")]
    [Authorize(Roles = "Registered")]
    public async Task<IActionResult> GetUpcomingFollowUps(CancellationToken cancellationToken)
    {

        
        // 1. Use the pattern your controller already uses to get the ID
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var query = new GetUpcomingFollowUpsQuery(userId);

        // 2. Use the injected _sender field instead of the undefined 'Sender' property
        var result = await _sender.Send(query, cancellationToken);

        return result.Match(Ok, Problem);
    }
}
