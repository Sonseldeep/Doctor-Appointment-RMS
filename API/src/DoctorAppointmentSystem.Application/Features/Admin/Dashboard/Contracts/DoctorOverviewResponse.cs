namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

public sealed record DoctorOverviewResponse(
    int TotalDoctors,
    int PendingApproval,
    int Active,
    int Suspended);