using DoctorAppointmentSystem.Application.Abstractions.Admin;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.GetDashboardOverview;

internal sealed class GetDashboardOverviewQueryHandler
    : IQueryHandler<GetDashboardOverviewQuery, DashboardOverviewResponse>
{
    private readonly IDashboardRepository _dashboardRepository;

    public GetDashboardOverviewQueryHandler(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public async Task<ErrorOr<DashboardOverviewResponse>> Handle(
        GetDashboardOverviewQuery request,
        CancellationToken cancellationToken)
    {
        return await _dashboardRepository.GetOverviewAsync(request, cancellationToken);
    }
}