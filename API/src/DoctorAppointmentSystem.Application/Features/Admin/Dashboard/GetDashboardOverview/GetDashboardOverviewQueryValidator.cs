using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.GetDashboardOverview;

internal sealed class GetDashboardOverviewQueryValidator : AbstractValidator<GetDashboardOverviewQuery>
{
    public GetDashboardOverviewQueryValidator()
    {
        RuleFor(x => x.TrendDays)
            .InclusiveBetween(7, 90)
            .WithMessage("Trend range must be between 7 and 90 days.");
    }
}