using System.Security.Claims;
using DoctorAppointmentSystem.Application.Users.GetCurrentUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[ApiController]
[Route("users")]
    
public class UsersController : ApiController
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var parsed = Guid.TryParse(userIdValue, out var userId);

        if (!parsed)
        {
            return Unauthorized();
        }

        var query = new GetCurrentUserQuery(userId);

        var result = await _sender.Send(query, cancellationToken);

        return result.Match(
            Ok,
            Problem);
    }
}