using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.ApproveDoctor;

public sealed record ApproveDoctorCommand(Guid DoctorUserId) : ICommand;