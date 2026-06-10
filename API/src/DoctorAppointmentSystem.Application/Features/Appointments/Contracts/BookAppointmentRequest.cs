namespace DoctorAppointmentSystem.Application.Features.Appointments.Contracts;


public sealed record BookAppointmentRequest(
    Guid DoctorUserId,
    Guid SlotId,
    string? Notes);