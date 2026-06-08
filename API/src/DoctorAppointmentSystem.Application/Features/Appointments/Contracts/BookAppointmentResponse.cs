namespace DoctorAppointmentSystem.Application.Features.Appointments.Contracts;

public sealed record BookAppointmentResponse(
    Guid AppointmentId,
    string Status,
    string Message);