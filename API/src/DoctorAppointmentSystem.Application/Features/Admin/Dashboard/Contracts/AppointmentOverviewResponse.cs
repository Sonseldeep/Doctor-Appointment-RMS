namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

public sealed record AppointmentOverviewResponse(
    int Total,
    int Pending,
    int Confirmed,
    int Cancelled,
    int Completed,
    int Today);