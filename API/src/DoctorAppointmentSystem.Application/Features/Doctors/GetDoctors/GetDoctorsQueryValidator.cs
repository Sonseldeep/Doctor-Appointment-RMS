using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

internal sealed class GetDoctorsQueryValidator : AbstractValidator<GetDoctorsQuery>
{
    public GetDoctorsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
        RuleFor(x => x.SearchTerm).MaximumLength(100).When(x => x.SearchTerm is not null);
        RuleFor(x => x.Specialization).IsInEnum().When(x => x.Specialization.HasValue);
    }
}