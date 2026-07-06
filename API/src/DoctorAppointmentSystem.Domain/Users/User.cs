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
        UserRole role,
        DateTimeOffset now)
        : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        TokenVersion = Guid.NewGuid();
        IsEmailVerified = false;
        // PasswordChangeAt = now;
        FailedLoginAttempts = 0;
        LockedOutUntil = null;
    }

    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public UserRole Role { get; private set; }
    public Guid TokenVersion { get; private set; }

    public bool IsEmailVerified { get; private set; }

    public string? ProfilePhotoUrl { get; private set; }

    public int FailedLoginAttempts { get; private set; }

    public DateTimeOffset? LockedOutUntil { get; private set; }

    // public DateTimeOffset PasswordChangeAt { get; private set; }

    public static User Create(string firstName, string lastName, string email, string passwordHash, UserRole role, DateTimeOffset now)
    {
        var user = new User(Guid.NewGuid(), firstName, lastName, email, passwordHash, role,now);
        return user;
    }
    
    

    public void RotateTokenVersion()
    {
        TokenVersion = Guid.NewGuid();
    }

    public void VerifyEmail()
    {
        IsEmailVerified = true;
    }
    
    public void ChangePasswordHash(string passwordHash, DateTimeOffset changeAt)
    {
        PasswordHash = passwordHash;
        // PasswordChangeAt = changeAt;
        
        FailedLoginAttempts = 0;
        LockedOutUntil = null;
    }

    public void UpdateProfilePhoto(string url)
    {
        ProfilePhotoUrl = url;
    }

    public bool IsLockedOut(DateTimeOffset now)
    {
        return LockedOutUntil is not null && LockedOutUntil.Value > now;
    }

    public bool RecordFailedLoginAttempt(int maxAttempts, TimeSpan lockoutDuration, DateTimeOffset now)
    {
        FailedLoginAttempts++;

        if (FailedLoginAttempts < maxAttempts)
        {
            return false;
        }
        
        LockedOutUntil = now.Add(lockoutDuration);
        return true;
    }

    public void ResetLockout()
    {
        FailedLoginAttempts = 0;
        LockedOutUntil = null;
    }


    
}