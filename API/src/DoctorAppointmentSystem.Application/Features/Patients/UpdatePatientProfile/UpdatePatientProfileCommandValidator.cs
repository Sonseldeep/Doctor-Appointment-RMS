using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Patients.UpdatePatientProfile;

internal sealed class UpdatePatientProfileCommandValidator
    : AbstractValidator<UpdatePatientProfileCommand>
{
    public UpdatePatientProfileCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(30);

        RuleFor(x => x.Address)
            .MaximumLength(500);
    }
}