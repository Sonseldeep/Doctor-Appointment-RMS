using DoctorAppointmentSystem.Api.Common.Request;
using DoctorAppointmentSystem.Application.Abstractions.Storage;
using DoctorAppointmentSystem.Application.Features.Users.GetCurrentUser;
using DoctorAppointmentSystem.Application.Features.Users.UserProfilePhoto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("users/me")]
    
public sealed class UsersController : ApiController
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }
        
        var query = new GetCurrentUserQuery(userId);

        var result = await _sender.Send(query, cancellationToken);

        return result.Match(Ok, Problem);
    }


    [HttpPost("photo")]
    [Authorize]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadProfilePhoto([FromForm] UploadPhotoRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }
        
        var fileUpload = new FileUploadModel(request.File.OpenReadStream(), request.File.FileName, request.File.ContentType, request.File.Length);
        
        var command =  new UploadProfilePhotoCommand(userId, fileUpload);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.Match(Ok, Problem);
    }
}