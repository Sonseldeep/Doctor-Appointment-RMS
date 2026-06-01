using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal sealed class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtOptions _options;

    public JwtTokenGenerator(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string GenerateAccessToken(IReadOnlyCollection<Claim> claims)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_options.Secret);
        var signingKey = new SymmetricSecurityKey(keyBytes);
        var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var utcNow = DateTime.UtcNow;
        var expiresAtUtc = utcNow.AddMinutes(_options.AccessTokenMinutes);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: utcNow,
            expires: expiresAtUtc,
            signingCredentials: signingCredentials);

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
    }
}