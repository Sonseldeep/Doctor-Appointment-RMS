namespace DoctorAppointmentSystem.Application.Users.GetLoggedInUser;

public sealed record UserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    IReadOnlyList<string> Roles);
