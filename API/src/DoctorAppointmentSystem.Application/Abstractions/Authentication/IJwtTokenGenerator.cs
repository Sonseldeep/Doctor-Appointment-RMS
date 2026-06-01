using System.Security.Claims;

namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(IReadOnlyCollection<Claim> claims);
}