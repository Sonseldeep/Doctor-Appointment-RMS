using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ResetPassword;

internal sealed class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    private const int OtpLength = 6;
    private const int MinPasswordLength = 6;

    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();

        RuleFor(x => x.Otp)
            .NotEmpty()
            .Length(OtpLength)
            .Matches("^[0-9]+$");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .MinimumLength(MinPasswordLength);
    }
}