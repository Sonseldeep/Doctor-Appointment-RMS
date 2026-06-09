using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Patients;

public sealed class PatientProfile : Entity
{
    private PatientProfile() { }

    private PatientProfile(Guid userId) : base(Guid.NewGuid())
    {
        UserId = userId;
        Sex = Sex.Unknown;
        CreatedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid UserId { get; private set; }

    public string? PhoneNumber { get; private set; }
    public string? Address { get; private set; }

    public Sex Sex { get; private set; }

    public DateOnly DateOfBirth { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }

    public static PatientProfile Create(Guid userId) => new(userId);

    public void Update(string? phoneNumber, string? address, Sex sex, DateOnly dateOfBirth)
    {
        PhoneNumber = string.IsNullOrWhiteSpace(phoneNumber) ? null : phoneNumber.Trim();
        Address = string.IsNullOrWhiteSpace(address) ? null : address.Trim();
        Sex = sex;
        DateOfBirth = dateOfBirth;
    }
}