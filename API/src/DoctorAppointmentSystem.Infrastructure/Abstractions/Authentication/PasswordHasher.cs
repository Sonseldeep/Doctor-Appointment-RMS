using DoctorAppointmentSystem.Application.Abstractions.Authentication;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        return passwordHash;

    }

    public bool Verify(string password, string passwordHash)
    {
        var isValid = BCrypt.Net.BCrypt.Verify(password, passwordHash);
        return isValid;
    }
}