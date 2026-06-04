using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Appointments.CompleteAppointment;

public sealed record CompleteAppointmentCommand(
    Guid DoctorUserId,
    Guid AppointmentId
) : ICommand;