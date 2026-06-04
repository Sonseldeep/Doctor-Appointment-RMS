using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Appointments.CancelAppointment;

public sealed record CancelAppointmentCommand(
    Guid PatientUserId,
    Guid AppointmentId
) : ICommand;