using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Authentication.Common.Contracts;

namespace DoctorAppointmentSystem.Application.Authentication.Refresh;

public sealed record RefreshCommand(string RefreshToken) : ICommand<LoginResponse>;