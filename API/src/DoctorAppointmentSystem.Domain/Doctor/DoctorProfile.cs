using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Doctor;

public sealed class DoctorProfile : Entity
{
    private DoctorProfile() { }

    private DoctorProfile(
        Guid userId,
        string bio,
        Specialization specialization,
        decimal consultationFee)
        : base(Guid.NewGuid())
    {
        UserId = userId;
        Bio = bio;
        Specialization = specialization;
        ConsultationFee = consultationFee;
        Status = DoctorStatus.Active; 
        CreatedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid UserId { get; private set; }

    public string Bio { get; private set; } = string.Empty;

    public Specialization Specialization { get; private set; }

    public decimal ConsultationFee { get; private set; }

    public DoctorStatus Status { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public static DoctorProfile Create(
        Guid userId,
        string bio,
        Specialization specialization,
        decimal consultationFee)
        => new(userId, bio, specialization, consultationFee);

    public void Update(string bio, Specialization specialization, decimal consultationFee)
    {
        Bio = bio;
        Specialization = specialization;
        ConsultationFee = consultationFee;
    }

    public void Activate() => Status = DoctorStatus.Active;

    public void Suspend() => Status = DoctorStatus.Suspended;
}