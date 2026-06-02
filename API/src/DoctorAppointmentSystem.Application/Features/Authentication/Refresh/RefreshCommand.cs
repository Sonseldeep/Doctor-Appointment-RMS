using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Authentication.Refresh;

public sealed record RefreshCommand(string RefreshToken) : ICommand<LoginResponse>;