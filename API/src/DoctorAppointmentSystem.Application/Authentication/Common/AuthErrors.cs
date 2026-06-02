using ErrorOr;

namespace DoctorAppointmentSystem.Application.Authentication.Common;

internal static class AuthErrors
{
    public static Error EmailAlreadyExists => Error.Conflict(
        code: "Auth.EmailAlreadyExists",
        description: "A user with this email already exists.");

    public static Error InvalidCredentials => Error.Unauthorized(
        code: "Auth.InvalidCredentials",
        description: "Invalid email or password.");

    public static Error RefreshTokenInvalid => Error.Unauthorized(
        code: "Auth.RefreshTokenInvalid",
        description: "Refresh token is invalid, expired, or revoked.");

    public static Error RefreshTokenMissing => Error.Unauthorized(
        code: "Auth.RefreshTokenMissing",
        description: "Refresh token cookie is missing.");
}