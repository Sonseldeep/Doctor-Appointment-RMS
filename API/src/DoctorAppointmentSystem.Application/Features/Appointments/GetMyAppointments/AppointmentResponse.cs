using DoctorAppointmentSystem.Domain.Appointments;

namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;

public sealed record AppointmentResponse(
    Guid Id,
    Guid PatientUserId,
    Guid DoctorUserId,
    DateTimeOffset StartUtc,
    DateTimeOffset EndUtc,
    AppointmentStatus Status,
    string? Notes
);