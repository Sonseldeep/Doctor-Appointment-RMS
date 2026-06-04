using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Doctors.CreateDoctorProfile;

internal sealed class CreateDoctorProfileCommandValidator
    : AbstractValidator<CreateDoctorProfileCommand>
{
    public CreateDoctorProfileCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Bio).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.ConsultationFee).GreaterThanOrEqualTo(0);
    }
}