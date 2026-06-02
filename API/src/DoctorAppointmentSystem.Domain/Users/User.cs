using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Users;

public sealed class User : Entity
{
    private User()
    {
    }

    private User(
        Guid id,
        string firstName,
        string lastName,
        string email, 
        string passwordHash,
        UserRole role)
        : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        TokenVersion = Guid.NewGuid();
    }

    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public UserRole Role { get; private set; }
    public Guid TokenVersion { get; private set; } 


    public static User Create(string firstName, string lastName, string email, string passwordHash, UserRole role)
    {
        var user = new User(Guid.NewGuid(), firstName, lastName, email, passwordHash, role);
        return user;
    }
    
    

    public void RotateTokenVersion()
    {
        TokenVersion = Guid.NewGuid();
    }
    
    
}