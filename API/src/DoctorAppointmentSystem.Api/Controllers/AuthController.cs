using DoctorAppointmentSystem.Api.Common.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Features.Authentication.ChangePassword;
using DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;
using DoctorAppointmentSystem.Application.Features.Authentication.ForgetPassword;
using DoctorAppointmentSystem.Application.Features.Authentication.Login;
using DoctorAppointmentSystem.Application.Features.Authentication.Logout;
using DoctorAppointmentSystem.Application.Features.Authentication.Refresh;
using DoctorAppointmentSystem.Application.Features.Authentication.Register;
using DoctorAppointmentSystem.Application.Features.Authentication.ResendOtp;
using DoctorAppointmentSystem.Application.Features.Authentication.ResetPassword;
using DoctorAppointmentSystem.Application.Features.Authentication.VerifyEmail;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("auth")]
public sealed class AuthController : ApiController
{
    private readonly ISender _sender;
    private readonly IRefreshTokenLifetime  _refreshTokenLifetime;
    private readonly IDateTimeProvider _dateTimeProvider;


    public AuthController(ISender sender, IRefreshTokenLifetime refreshTokenLifetime, IDateTimeProvider dateTimeProvider)
    {
        _sender = sender;
        _refreshTokenLifetime = refreshTokenLifetime;
        _dateTimeProvider = dateTimeProvider;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting("auth-ip-register")]

    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var command = new RegisterCommand(request.FirstName, request.LastName, request.Email, request.Password, request.Role);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            _ => Ok(new { message = "User registered successfully." }),  
            Problem);
    }

    [HttpPost("verify-email")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request, CancellationToken cancellationToken)
    {
        var command = new VerifyEmailCommand(request.Email, request.Otp);
        var result = await _sender.Send(command, cancellationToken);
        
        return result.Match(
            _ => Ok(new { message = "Email verified successfully. You can now log in" }),
            Problem);
    }
    
    [HttpPost("resend-otp")]
    [AllowAnonymous]
    [EnableRateLimiting("otp-ip-resend")]
    public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest request, CancellationToken cancellationToken)
    {
        var command = new ResendOtpCommand(request.Email);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            _ => Ok(new { message = "If the account exists and is unverified, a new OTP was sent." }),
            Problem);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("auth-ip-login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var command = new LoginCommand(request.Email, request.Password);

        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            success =>
            {
                AppendRefreshTokenCookie(success.RefreshToken);
                var response = new AuthResponse(success.AccessToken, success.MustChangePassword);
                return Ok(response);
            },
            Problem);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
    {
        var found = Request.Cookies.TryGetValue(AuthCookies.RefreshTokenCookieName, out var refreshToken);
        
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
                var response = new AuthResponse(success.AccessToken, success.MustChangePassword);
                return Ok(response);
            },
            Problem);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [EnableRateLimiting("otp-ip-forgot")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var command = new ForgotPasswordCommand(request.Email);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            _ => Ok(new { message = "If the account exists, a password reset OTP was sent." }),
            Problem);
    }
    
    [HttpPost("reset-password")]
    [AllowAnonymous]
    [EnableRateLimiting("otp-ip-reset")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var command = new ResetPasswordCommand(request.Email, request.Otp, request.NewPassword);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            _ => Ok(new { message = "Password has been reset. Please log in again." }),
            Problem);
    }
    
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized();
        }

        var command = new ChangePasswordCommand(userId, request.CurrentPassword, request.NewPassword);
        var result = await _sender.Send(command, cancellationToken);

        return result.Match(
            _ =>
            {
                DeleteRefreshTokenCookie();
                return NoContent();
            },
            Problem);
    }
    
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId))
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
            Problem);
    }

    private void AppendRefreshTokenCookie(string refreshToken)
    {
        var expiresAt = _dateTimeProvider.UtcNow.Add(_refreshTokenLifetime.Duration);

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