namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

public sealed record DashboardOverviewResponse(
    UserOverviewResponse Users,
    DoctorOverviewResponse Doctors,
    AppointmentOverviewResponse Appointments,
    IReadOnlyList<AppointmentTrendPointResponse> AppointmentTrend,
    IReadOnlyList<TopRatedDoctorResponse> TopRatedDoctors,
    DateTimeOffset GeneratedAtUtc);
