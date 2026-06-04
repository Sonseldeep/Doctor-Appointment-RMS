using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Doctors.UpdateDoctorProfile;

internal sealed class UpdateDoctorProfileCommandValidator
    : AbstractValidator<UpdateDoctorProfileCommand>
{
    public UpdateDoctorProfileCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Bio).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.ConsultationFee).GreaterThanOrEqualTo(0);
    }
}