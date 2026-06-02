using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ChangePassword;

public sealed record ChangePasswordCommand(Guid UserId, string CurrentPassword, string NewPassword) : ICommand;