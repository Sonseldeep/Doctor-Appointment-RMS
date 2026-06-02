namespace DoctorAppointmentSystem.Application.Features.Users.GetCurrentUser;

public sealed record CurrentUserResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Role);