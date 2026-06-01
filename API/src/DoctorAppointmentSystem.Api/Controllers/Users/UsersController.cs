using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Users.GetLoggedInUser;
using DoctorAppointmentSystem.Application.Users.Login;
using DoctorAppointmentSystem.Application.Users.RefreshToken;
using DoctorAppointmentSystem.Application.Users.RegisterUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers.Users;

[Route("api/users")]
public sealed class UsersController(ISender sender) : ApiController
{
    [HttpGet("me")]
    [Authorize(Roles = Roles.Registered)]
    public async Task<IActionResult> GetLoggedInUser(CancellationToken ct)
    {
        var result = await sender.Send(new GetLoggedInUserQuery(), ct);

        return result.Match(Ok, Problem);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterUserRequest request,
        CancellationToken ct)
    {
        var result = await sender.Send(
            new RegisterUserCommand(
                request.Email,
                request.FirstName,
                request.LastName,
                request.Password), ct);

        return result.Match(userId => Ok(userId), Problem);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LogInUserRequest request,
        CancellationToken ct)
    {
        var result = await sender.Send(
            new LogInUserCommand(request.Email, request.Password), ct);

        return result.Match(Ok, Problem);
    }
    
    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken(
        RefreshTokenRequest request,
        CancellationToken ct)
    {
        var result = await sender.Send(
            new RefreshTokenCommand(request.RefreshToken), ct);

        return result.Match(Ok, Problem);
    }
    

}