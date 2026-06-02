using FluentValidation;

namespace DoctorAppointmentSystem.Application.Authentication.VerifyEmail;

public class VerifyEmailCommandValidator : AbstractValidator<VerifyEmailCommand>
{
    private const int OtpLength = 6;

    public VerifyEmailCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
        
        RuleFor(x => x.Otp)
            .NotEmpty()
            .Length(OtpLength)
            .Matches("^[0-9]+$")
            .WithMessage("OTP must be a 6-digit number.");
    }
}