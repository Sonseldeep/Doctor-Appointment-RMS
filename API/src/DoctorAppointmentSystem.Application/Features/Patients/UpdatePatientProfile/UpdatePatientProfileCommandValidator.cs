using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Patients.UpdatePatientProfile;

internal sealed class UpdatePatientProfileCommandValidator
    : AbstractValidator<UpdatePatientProfileCommand>
{
    public UpdatePatientProfileCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();

        RuleFor(x => x.PhoneNumber)
            .Length(10).WithMessage("Phone number must be exactly 10 digits.")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

        RuleFor(x => x.Address)
            .MaximumLength(500);
    }
}