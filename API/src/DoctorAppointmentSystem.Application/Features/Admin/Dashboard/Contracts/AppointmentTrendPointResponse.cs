namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

public sealed record AppointmentTrendPointResponse(
    DateOnly Date,
    int BookedCount,
    int CompletedCount,
    int CancelledCount);