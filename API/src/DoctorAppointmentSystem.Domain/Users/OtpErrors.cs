using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Users;

public class OtpErrors
{
    public static Error InValid => Error.Validation(
        code: "Otp.Invalid",
        description: "The provided OTP is invalid or has expired."
    );

    public static Error AlreadyVerified => Error.Conflict(
        code: "Otp.AlreadyVerified",
        description: "The provided OTP has already been verified."
    );
}