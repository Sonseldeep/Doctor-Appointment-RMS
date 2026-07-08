
namespace DoctorAppointmentSystem.Api.Common.Authentication;

internal static class RefreshTokenCookieOptions
{
    public static CookieOptions Create(DateTimeOffset expiresAt)
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = expiresAt.UtcDateTime,
            Path = "/auth"
        };

        return options;
    }

    public static CookieOptions CreateDelete()
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UnixEpoch.UtcDateTime,
            Path = "/auth"
        };

        return options;
    }
}

