using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Availability.GetDoctoreSlots;

internal sealed class GetDoctorSlotsQueryValidator : AbstractValidator<GetDoctorSlotsQuery>
{
    public GetDoctorSlotsQueryValidator()
    {
        RuleFor(x => x.DoctorUserId).NotEmpty();
        RuleFor(x => x.Date)
            .Must(d => d >= DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Cannot browse slots for past dates.");
    }
}
