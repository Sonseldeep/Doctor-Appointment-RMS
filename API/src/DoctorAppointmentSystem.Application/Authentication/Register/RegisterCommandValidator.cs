using FluentValidation;

namespace DoctorAppointmentSystem.Application.Authentication.Register;

internal sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    private const int NameMaxLength = 100;
    private const int EmailMaxLength = 320;
    private const int MinPasswordLength = 6;

    public RegisterCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(NameMaxLength);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(NameMaxLength);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(EmailMaxLength);

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(MinPasswordLength);

        RuleFor(x => x.Role)
            .NotEmpty()
            .Must(BeAValidRole)
            .WithMessage("Role must be Registered, Doctor, or Admin.");
    }

    private static bool BeAValidRole(string role)
    {
        return string.Equals(role, "Registered", StringComparison.OrdinalIgnoreCase)
               || string.Equals(role, "Doctor", StringComparison.OrdinalIgnoreCase)
               || string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
    }
}