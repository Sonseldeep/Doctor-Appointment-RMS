using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Authentication.Login;


public sealed record LoginCommand(string Email, string Password)
    : ICommand<LoginResponse>;