using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;

internal sealed class GetMyNotificationsQueryValidator : AbstractValidator<GetMyNotificationsQuery>
{
    public GetMyNotificationsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}