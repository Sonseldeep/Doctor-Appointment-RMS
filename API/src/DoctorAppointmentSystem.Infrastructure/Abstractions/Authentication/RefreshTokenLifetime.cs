using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using Microsoft.Extensions.Options;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal sealed class RefreshTokenLifetime : IRefreshTokenLifetime
{
    private readonly JwtOptions _jwtOptions;

    public RefreshTokenLifetime(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }

    public TimeSpan Duration => TimeSpan.FromDays(_jwtOptions.RefreshTokenDays);
}