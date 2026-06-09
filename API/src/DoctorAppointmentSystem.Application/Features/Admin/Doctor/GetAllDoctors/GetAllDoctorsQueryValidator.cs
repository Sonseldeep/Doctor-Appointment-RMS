using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;

internal sealed class GetAllDoctorsQueryValidator : AbstractValidator<GetAllDoctorsQuery>
{
    public GetAllDoctorsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        RuleFor(x => x.SearchTerm).MaximumLength(100).When(x => x.SearchTerm is not null);
        RuleFor(x => x.Specialization).IsInEnum().When(x => x.Specialization.HasValue);
        RuleFor(x => x.Status).IsInEnum().When(x => x.Status.HasValue);
    }
}