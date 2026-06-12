using DoctorAppointmentSystem.Api.Common.Request;
using DoctorAppointmentSystem.Application.Features.Ratings.DeleteRating;
using DoctorAppointmentSystem.Application.Features.Ratings.GetDoctorRating;
using DoctorAppointmentSystem.Application.Features.Ratings.SubmitRating;
using DoctorAppointmentSystem.Application.Features.Ratings.UpdateRating;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/ratings")]
public sealed class RatingsController : ApiController
{
    private readonly ISender _sender;

    public RatingsController(ISender sender)
    {
        _sender = sender;
    }
    
    [HttpGet("doctors/{doctorUserId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDoctorRatings(Guid doctorUserId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetDoctorRatingsQuery(doctorUserId), cancellationToken);
        return result.Match(Ok, Problem);
    }

    [HttpPost("doctors/{doctorUserId:guid}")]
    [Authorize]
    public async Task<IActionResult> SubmitRating(Guid doctorUserId, [FromBody] SubmitRatingRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var patientUserId))
        {
            return Unauthorized();
        }

        var command = new SubmitRatingCommand(patientUserId, doctorUserId, request.Stars, request.Comment);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match(ratingId => CreatedAtAction(nameof(GetDoctorRatings), new { doctorUserId }, new { ratingId }),
            Problem);
    }

 
    [HttpPut("{ratingId:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateRating(Guid ratingId, [FromBody] UpdateRatingRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var patientUserId))
        {
            return Unauthorized();
        }

        var command = new UpdateRatingCommand(patientUserId, ratingId, request.Stars, request.Comment);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match(_ => NoContent(), Problem);
    }

   
    [HttpDelete("{ratingId:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteRating(Guid ratingId, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var patientUserId))
        {
            return Unauthorized();
        }

        var command = new DeleteRatingCommand(patientUserId, ratingId);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match(_ => NoContent(), Problem);
    }
}


