
namespace DoctorAppointmentSystem.Api.Common.Authentication;

internal static class RefreshTokenCookieOptions
{
    public static CookieOptions Create(DateTimeOffset expiresAt)
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = expiresAt.UtcDateTime
        };

        return options;
    }

    public static CookieOptions CreateDelete()
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UnixEpoch.UtcDateTime
        };

        return options;
    }
}