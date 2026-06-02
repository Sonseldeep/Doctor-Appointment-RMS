using System.Security.Claims;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal sealed class TokenVersionValidator
{
    private readonly IUserRepository _userRepository;

    public TokenVersionValidator(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task ValidateAsync(TokenValidatedContext context)
    {
        var principal = context.Principal!;
        var userIdValue = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var tokenVersionValue = principal.FindFirstValue(AuthClaimTypes.TokenVersion);

        var parsedUserId = Guid.TryParse(userIdValue, out Guid userId);
        var parsedVersion = Guid.TryParse(tokenVersionValue, out Guid tokenVersion);

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
        }
    }
}