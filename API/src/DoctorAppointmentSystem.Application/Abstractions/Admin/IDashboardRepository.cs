using DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;
using DoctorAppointmentSystem.Application.Features.Admin.Dashboard.GetDashboardOverview;

namespace DoctorAppointmentSystem.Application.Abstractions.Admin;

public interface IDashboardRepository
{
    Task<DashboardOverviewResponse> GetOverviewAsync(GetDashboardOverviewQuery query,
        CancellationToken cancellationToken);
}
