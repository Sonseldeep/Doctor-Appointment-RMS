using System.Security.Cryptography;
using System.Text;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal static class RefreshTokenHash
{
    public static string Compute(string refreshToken)
    {
        var tokenBytes = Encoding.UTF8.GetBytes(refreshToken);
        var hashBytes = SHA256.HashData(tokenBytes);

        var hash = Convert.ToBase64String(hashBytes);
        return hash;
    }
}