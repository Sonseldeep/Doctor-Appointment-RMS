using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Appointments.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;

public sealed record BookAppointmentCommand(
    Guid PatientUserId,
    Guid DoctorUserId,
    DateTimeOffset StartUtc,
    DateTimeOffset EndUtc,
    string? Notes
) : ICommand<BookAppointmentResponse>;