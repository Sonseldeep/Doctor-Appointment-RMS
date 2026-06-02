using DoctorAppointmentSystem.Application.Authentication.ResendOtp;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ResendOtp;

public  sealed class ResendOtpCommandValidator : AbstractValidator<ResendOtpCommand>
{
    public ResendOtpCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}