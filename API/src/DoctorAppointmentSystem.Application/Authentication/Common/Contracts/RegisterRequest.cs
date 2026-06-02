namespace DoctorAppointmentSystem.Application.Authentication.Common.Contracts;

public sealed record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Role);