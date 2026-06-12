using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Ratings.UpdateRating;

internal sealed class UpdateRatingCommandValidator : AbstractValidator<UpdateRatingCommand>
{
    public UpdateRatingCommandValidator()
    {
        RuleFor(x => x.Stars)
            .InclusiveBetween(1, 5)
            .WithMessage("Stars must be between 1 and 5.");

        RuleFor(x => x.Comment)
            .MaximumLength(1000)
            .When(x => x.Comment is not null)
            .WithMessage("Comment must not exceed 1000 characters.");
    }
}