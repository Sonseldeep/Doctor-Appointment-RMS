using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Doctors.CreateDoctorProfile;

internal sealed class CreateDoctorProfileCommandValidator : AbstractValidator<CreateDoctorProfileCommand>
{
    public CreateDoctorProfileCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.NmcNumber)
            .NotEmpty().WithMessage("NMC number is required.")
            .MinimumLength(5).WithMessage("NMC number must be at least 5 characters.")
            .MaximumLength(20).WithMessage("NMC number cannot exceed 20 characters.")
            .Matches("^[A-Za-z0-9]+$").WithMessage("NMC number must contain only letters and numbers.");

        RuleFor(x => x.Bio)
            .NotEmpty().WithMessage("Bio is required.")
            .MaximumLength(2000).WithMessage("Bio cannot exceed 2000 characters.");

        RuleFor(x => x.Specialization)
            .IsInEnum().WithMessage("Invalid specialization.");

        RuleFor(x => x.ConsultationFee)
            .GreaterThan(0).WithMessage("Consultation fee must be greater than zero.")
            .LessThanOrEqualTo(100000).WithMessage("Consultation fee seems unreasonably high.");
    }
}
