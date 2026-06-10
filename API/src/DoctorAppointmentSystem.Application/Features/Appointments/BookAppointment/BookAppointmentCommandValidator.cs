using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;

internal sealed class BookAppointmentCommandValidator : AbstractValidator<BookAppointmentCommand>
{
    public BookAppointmentCommandValidator()
    {
        RuleFor(x => x.PatientUserId)
            .NotEmpty()
            .WithMessage("Patient user ID is required.");

        RuleFor(x => x.DoctorUserId)
            .NotEmpty()
            .WithMessage("Doctor user ID is required.")
            .NotEqual(x => x.PatientUserId)
            .WithMessage("Patient and doctor cannot be the same person.");

        RuleFor(x => x.SlotId)
            .NotEmpty()
            .WithMessage("A time slot must be selected.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}