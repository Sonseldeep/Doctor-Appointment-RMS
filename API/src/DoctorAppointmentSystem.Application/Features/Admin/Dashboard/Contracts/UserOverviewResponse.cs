namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

public sealed record UserOverviewResponse(
    int TotalPatients,
    int TotalDoctors);