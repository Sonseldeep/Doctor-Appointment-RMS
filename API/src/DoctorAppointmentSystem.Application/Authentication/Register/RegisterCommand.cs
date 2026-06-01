using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Authentication.Contracts;

namespace DoctorAppointmentSystem.Application.Authentication.Register;

public sealed record RegisterCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Role) : ICommand<AuthResponse>;