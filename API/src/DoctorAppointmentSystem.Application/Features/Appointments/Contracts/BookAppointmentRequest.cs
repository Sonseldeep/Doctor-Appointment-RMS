namespace DoctorAppointmentSystem.Application.Features.Appointments.Contracts;


public sealed record BookAppointmentRequest(
    Guid DoctorUserId,
    DateTimeOffset StartUtc,
    DateTimeOffset EndUtc,
    string? Notes);