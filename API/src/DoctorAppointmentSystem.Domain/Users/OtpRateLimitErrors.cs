using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Users;

public static class OtpRateLimitErrors
{
    public static Error TooManyRequests => Error.Validation(
        code: "Otp.TooManyRequests",
        description: "Too many OTP requests. Please try again later."
    );
}