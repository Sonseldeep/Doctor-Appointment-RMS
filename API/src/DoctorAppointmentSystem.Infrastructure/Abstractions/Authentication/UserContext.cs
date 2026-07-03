using System;
using System.Security.Claims;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Http;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

public sealed class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId
    {
        get
        {
            var claimValue = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claimValue, out var parsedGuid) ? parsedGuid : Guid.Empty;
        }
    }

    public string IpAddress
    {
        get
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext is null) return "UNKNOWN";

            string? forwardedHeader = httpContext.Request.Headers["X-Forwarded-For"];
            if (!string.IsNullOrWhiteSpace(forwardedHeader))
            {
                return forwardedHeader.Split(',')[0].Trim();
            }

            return httpContext.Connection.RemoteIpAddress?.ToString() ?? "UNKNOWN";
        }
    }
}