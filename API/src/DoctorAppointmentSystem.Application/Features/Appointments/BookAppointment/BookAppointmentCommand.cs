using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Appointments.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;

public sealed record BookAppointmentCommand(
    Guid PatientUserId,
    Guid DoctorUserId,
    Guid SlotId,
    string? Notes
) : ICommand<BookAppointmentResponse>;