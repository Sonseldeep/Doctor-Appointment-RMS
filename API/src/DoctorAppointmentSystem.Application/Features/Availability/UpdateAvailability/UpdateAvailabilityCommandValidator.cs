using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Availability.UpdateAvailability;

internal sealed class UpdateAvailabilityCommandValidator : AbstractValidator<UpdateAvailabilityCommand>
{
    public UpdateAvailabilityCommandValidator()
    {
        RuleFor(x => x.AvailabilityId).NotEmpty();
        RuleFor(x => x.DoctorUserId).NotEmpty();
        RuleFor(x => x.EndTime)
            .GreaterThan(x => x.StartTime)
            .WithMessage("End time must be after start time.");
        RuleFor(x => x.SlotDurationMinutes)
            .InclusiveBetween(15, 120)
            .WithMessage("Slot duration must be between 15 and 120 minutes.");
    }
}
