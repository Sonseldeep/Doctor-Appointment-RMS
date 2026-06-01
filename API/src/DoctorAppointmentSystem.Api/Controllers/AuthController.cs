using System.Security.Claims;
using DoctorAppointmentSystem.Api.Common.Authentication;
using DoctorAppointmentSystem.Application.Authentication.Common.Contracts;
using DoctorAppointmentSystem.Application.Authentication.Login;
using DoctorAppointmentSystem.Application.Authentication.Logout;
using DoctorAppointmentSystem.Application.Authentication.Refresh;
using DoctorAppointmentSystem.Application.Authentication.Register;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("auth")]
public sealed class AuthController : ApiController
{
    private readonly ISender _sender;

    public AuthController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var command = new RegisterCommand(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Password,
            request.Role);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            Ok,
            Problem);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var command = new LoginCommand(request.Email, request.Password);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            success =>
            {
                AppendRefreshTokenCookie(success.RefreshToken);
                var response = new AuthResponse(success.AccessToken);
                return Ok(response);
            },
            Problem);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
    {
        var found = Request.Cookies.TryGetValue(AuthCookies.RefreshTokenCookieName, out string? refreshToken);
        if (!found || string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized();
        }

        var command = new RefreshCommand(refreshToken);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            success =>
            {
                AppendRefreshTokenCookie(success.RefreshToken);
                var response = new AuthResponse(success.AccessToken);
                return Ok(response);
            },
            Problem);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var parsed = Guid.TryParse(userIdValue, out Guid userId);

        if (!parsed)
        {
            return Unauthorized();
        }

        var command = new LogoutCommand(userId);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            _ =>
            {
                DeleteRefreshTokenCookie();
                return NoContent();
            },
            errors => Problem(errors));
    }

    private void AppendRefreshTokenCookie(string refreshToken)
    {
        var expiresAt = DateTimeOffset.UtcNow.AddDays(AuthCookieDefaults.RefreshTokenDays);

        Response.Cookies.Append(
            AuthCookies.RefreshTokenCookieName,
            refreshToken,
            RefreshTokenCookieOptions.Create(expiresAt));
    }

    private void DeleteRefreshTokenCookie()
    {
        Response.Cookies.Delete(
            AuthCookies.RefreshTokenCookieName,
            RefreshTokenCookieOptions.CreateDelete());
    }
}