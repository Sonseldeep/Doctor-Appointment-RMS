using System.Security.Claims;
using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

internal static class AuthClaims
{
    public static IReadOnlyCollection<Claim> Create(User user)
    {
        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new(AuthClaimTypes.TokenVersion, user.TokenVersion.ToString())

        ];

        return claims;
    }
}