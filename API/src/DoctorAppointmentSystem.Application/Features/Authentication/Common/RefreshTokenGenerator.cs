using System.Security.Cryptography;

namespace DoctorAppointmentSystem.Application.Features.Authentication.Common;

internal static class RefreshTokenGenerator
{
    private const int TokenByteLength = 64;

    public static string Generate()
    {
        var bytes = RandomNumberGenerator.GetBytes(TokenByteLength);
        var token = Convert.ToBase64String(bytes);
        return token;
    }
}