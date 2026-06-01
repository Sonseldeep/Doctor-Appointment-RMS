using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Users;

public static class UserErrors
{
    public static Error NotFound => Error.NotFound(
        code: "User.NotFound",
        description: "The user with the specified identifier was not found.");
    
}