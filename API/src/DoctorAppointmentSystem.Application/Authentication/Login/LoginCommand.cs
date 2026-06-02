using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Authentication.Common.Contracts;

namespace DoctorAppointmentSystem.Application.Authentication.Login;


public sealed record LoginCommand(string Email, string Password)
    : ICommand<LoginResponse>;