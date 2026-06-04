using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Appointments.ConfirmAppointment;

public sealed record ConfirmAppointmentCommand(
    Guid DoctorUserId,
    Guid AppointmentId
) : ICommand;