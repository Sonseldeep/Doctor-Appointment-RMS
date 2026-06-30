namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;

public sealed record GetMyAppointmentsRequest(
    int Page = 1,
    int PageSize = 10);
