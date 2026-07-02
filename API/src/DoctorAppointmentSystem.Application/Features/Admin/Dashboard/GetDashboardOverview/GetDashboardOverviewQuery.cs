using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.GetDashboardOverview;

public sealed record GetDashboardOverviewQuery(int TrendDays = 14)
    : IQuery<DashboardOverviewResponse>;
