//using ErrorOr;

//namespace DoctorAppointmentSystem.Application.Features.Authentication.Common;

//internal static class AuthErrors
//{
//    public static Error EmailAlreadyExists => Error.Conflict(
//        code: "Auth.EmailAlreadyExists",
//        description: "A user with this email already exists.");

//    public static Error InvalidCredentials => Error.Unauthorized(
//        code: "Auth.InvalidCredentials",
//        description: "Invalid email or password.");

//    public static Error RefreshTokenInvalid => Error.Unauthorized(
//        code: "Auth.RefreshTokenInvalid",
//        description: "Refresh token is invalid, expired, or revoked.");

//    public static Error AccountLocked(DateTimeOffset lockedOutUntil) => Error.Forbidden(
//        code: "Auth.AccountLocked",
//        description: "Too many failed login attempts. This account is temporarily locked. Please try again later.",
//        metadata: new Dictionary<string, object>
//        {
//            ["lockedOutUntil"] = lockedOutUntil
//        });
//}

using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Authentication.Common;

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

    public static Error AccountLocked(DateTimeOffset lockedOutUntil) => Error.Forbidden(
        code: "Auth.AccountLocked",
        description: "Too many failed login attempts. This account is temporarily locked. Please try again later.",
        metadata: new Dictionary<string, object>
        {
            ["lockedOutUntil"] = lockedOutUntil
        });
}