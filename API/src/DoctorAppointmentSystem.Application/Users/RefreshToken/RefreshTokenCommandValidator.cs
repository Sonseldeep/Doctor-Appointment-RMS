using FluentValidation;

namespace DoctorAppointmentSystem.Application.Users.RefreshToken;

internal sealed class RefreshTokenCommandValidator
    : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}