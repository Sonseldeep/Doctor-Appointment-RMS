using System.Security.Claims;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal sealed class TokenVersionValidator
{
    private static readonly string[] PasswordExpiryAllowList = [
        "/auth/change-password", "/auth/logout"
    ];
    
    private readonly IUserRepository _userRepository;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IPasswordPolicyOptions _passwordPolicyOptions;

    public TokenVersionValidator(IUserRepository userRepository,
        IDateTimeProvider dateTimeProvider,
        IPasswordPolicyOptions passwordPolicyOptions)
    {
        _userRepository = userRepository;
        _dateTimeProvider = dateTimeProvider;
        _passwordPolicyOptions = passwordPolicyOptions;
    }

    public async Task ValidateAsync(TokenValidatedContext context)
    {
        var principal = context.Principal!;
        var userIdValue = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var tokenVersionValue = principal.FindFirstValue(AuthClaimTypes.TokenVersion);

        var parsedUserId = Guid.TryParse(userIdValue, out var userId);
        var parsedVersion = Guid.TryParse(tokenVersionValue, out var tokenVersion);

        if (!parsedUserId || !parsedVersion)
        {
            context.Fail("Invalid token.");
            return;
        }

        var user = await _userRepository.GetByIdAsync(userId, context.HttpContext.RequestAborted);
        if (user is null)
        {
            context.Fail("User not found.");
            return;
        }

        if (user.TokenVersion != tokenVersion)
        {
            context.Fail("Token revoked.");
            return;
        }
        
        var utcNow = _dateTimeProvider.UtcNow;
        var passwordExpired = user.IsPasswordExpired(utcNow, _passwordPolicyOptions.MaxPasswordAge);

        if (passwordExpired && !IsOnPasswordExpiryAllowList(context.HttpContext.Request.Path))
        {
            context.Fail("Password has expired. Please change your password before continuing.");
        }
        
    }
    
    private static bool IsOnPasswordExpiryAllowList(PathString path)
    {
        foreach (var allowed in PasswordExpiryAllowList)
        {
            if (path.StartsWithSegments(allowed, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }
}