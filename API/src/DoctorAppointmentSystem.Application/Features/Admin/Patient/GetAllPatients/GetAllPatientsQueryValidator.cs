using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;

internal sealed class GetAllPatientsQueryValidator : AbstractValidator<GetAllPatientsQuery>
{
    private const int MaxPageSize = 100;

    public GetAllPatientsQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be at least 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, MaxPageSize)
            .WithMessage($"PageSize must be between 1 and {MaxPageSize}.");

        RuleFor(x => x.MinAge)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MinAge.HasValue)
            .WithMessage("MinAge cannot be negative.");

        RuleFor(x => x.MaxAge)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MaxAge.HasValue)
            .WithMessage("MaxAge cannot be negative.");

        RuleFor(x => x)
            .Must(x => x.MinAge is null || x.MaxAge is null || x.MinAge <= x.MaxAge)
            .WithName("AgeRange")
            .WithMessage("MinAge must be less than or equal to MaxAge.");

        RuleFor(x => x.Sex)
            .IsInEnum()
            .When(x => x.Sex.HasValue)
            .WithMessage("Sex value is not valid.");

        RuleFor(x => x.SearchTerm)
            .MaximumLength(100)
            .When(x => x.SearchTerm is not null)
            .WithMessage("SearchTerm cannot exceed 100 characters.");

        RuleFor(x => x.Address)
            .MaximumLength(200)
            .When(x => x.Address is not null)
            .WithMessage("Address filter cannot exceed 200 characters.");
    }
}