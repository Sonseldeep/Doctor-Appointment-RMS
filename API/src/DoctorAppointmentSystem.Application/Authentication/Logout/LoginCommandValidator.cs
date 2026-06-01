using DoctorAppointmentSystem.Application.Authentication.Login;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Authentication.Logout;

internal sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    private const int MinPasswordLength = 6;

    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(MinPasswordLength);
    }
}