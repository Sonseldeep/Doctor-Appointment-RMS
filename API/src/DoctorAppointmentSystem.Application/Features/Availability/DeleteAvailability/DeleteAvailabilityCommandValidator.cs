using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Availability.DeleteAvailability;

internal sealed class DeleteAvailabilityCommandValidator : AbstractValidator<DeleteAvailabilityCommand>
{
    public DeleteAvailabilityCommandValidator()
    {
        RuleFor(x => x.AvailabilityId).NotEmpty();
        RuleFor(x => x.DoctorUserId).NotEmpty();
    }
}
