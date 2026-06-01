using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DoctorAppointmentSystem.Infrastructure.Authentication;

internal sealed class JwtBearerEventsHandler : JwtBearerEvents
{
    private readonly ILogger<JwtBearerEventsHandler> _logger;

    public JwtBearerEventsHandler(ILogger<JwtBearerEventsHandler> logger)
    {
        _logger = logger;

        OnChallenge = HandleChallenge;
        OnForbidden = HandleForbidden;
        OnAuthenticationFailed = HandleAuthenticationFailed;
    }

    private static Task HandleChallenge(JwtBearerChallengeContext context)
    {
        context.HandleResponse();

        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/problem+json";

        var detail = context.AuthenticateFailure?.Message
                     ?? "No Bearer token provided or token is invalid.";

        return context.Response.WriteAsJsonAsync(new
        {
            status = 401,
            title = "Unauthorized",
            type = "Authentication.Failed",
            detail
        });
    }

    private static Task HandleForbidden(ForbiddenContext context)
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        context.Response.ContentType = "application/problem+json";

        return context.Response.WriteAsJsonAsync(new
        {
            status = 403,
            title = "Forbidden",
            type = "Authorization.Failed",
            detail = "You do not have the required role to access this resource."
        });
    }

    private Task HandleAuthenticationFailed(AuthenticationFailedContext context)
    {
        _logger.LogWarning(
            context.Exception,
            "JWT authentication failed: {Message}",
            context.Exception.Message);

        return Task.CompletedTask;
    }
}