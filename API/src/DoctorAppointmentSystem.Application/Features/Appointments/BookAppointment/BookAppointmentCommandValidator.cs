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

        RuleFor(x => x.StartUtc)
            .NotEmpty()
            .WithMessage("Start time is required.")
            .GreaterThan(DateTimeOffset.UtcNow)
            .WithMessage("Cannot book appointments in the past.");

        RuleFor(x => x.EndUtc)
            .NotEmpty()
            .WithMessage("End time is required.")
            .GreaterThan(x => x.StartUtc)
            .WithMessage("End time must be after start time.")
            .Must((command, endUtc) =>
            {
                var duration = endUtc - command.StartUtc;
                return duration.TotalMinutes is >= 15 and <= 60;
            })
            .WithMessage("Appointment duration must be between 15 minutes and 1 hours.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}