using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.SuspendDoctor;

public sealed record SuspendDoctorCommand(Guid DoctorUserId) : ICommand;