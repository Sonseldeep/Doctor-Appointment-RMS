using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Availability.CreateAvailability;

internal sealed class CreateAvailabilityCommandValidator : AbstractValidator<CreateAvailabilityCommand>
{
    public CreateAvailabilityCommandValidator()
    {
        RuleFor(x => x.DoctorUserId)
            .NotEmpty().WithMessage("Doctor user ID is required.");

        RuleFor(x => x.Date)
            .Must(d => d >= DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Cannot create availability for a past date.");

        RuleFor(x => x.EndTime)
            .GreaterThan(x => x.StartTime)
            .WithMessage("End time must be after start time.");

        RuleFor(x => x.SlotDurationMinutes)
            .InclusiveBetween(15, 120)
            .WithMessage("Slot duration must be between 15 and 120 minutes.");
    }
}
