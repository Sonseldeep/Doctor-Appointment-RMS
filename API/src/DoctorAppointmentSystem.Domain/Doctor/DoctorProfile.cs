using DoctorAppointmentSystem.Domain.Abstractions;
using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Domain.Doctor;

public sealed class DoctorProfile : Entity
{
    private DoctorProfile(string nmcNumber)
    {
        NmcNumber = nmcNumber;
    }

    private DoctorProfile(
        Guid userId,
        string nmcNumber,
        string bio,
        Specialization specialization,
        decimal consultationFee)
        : base(Guid.NewGuid())
    {
        UserId = userId;
        NmcNumber = nmcNumber;
        Bio = bio;
        Specialization = specialization;
        ConsultationFee = consultationFee;
        Status = DoctorStatus.Pending; 
        CreatedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid UserId { get; private set; }

    public string NmcNumber { get; private set; } 

    public string Bio { get; private set; } = string.Empty;

    public Specialization Specialization { get; private set; }

    public decimal ConsultationFee { get; private set; }

    public DoctorStatus Status { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }
    
    
    public User User { get; private set; } = null!;


    public static DoctorProfile Create(
        Guid userId,
        string nmcNumber,
        string bio,
        Specialization specialization,
        decimal consultationFee)
        => new(userId, nmcNumber, bio, specialization, consultationFee);

    public void Update(string bio, Specialization specialization, decimal consultationFee)
    {
        Bio = bio;
        Specialization = specialization;
        ConsultationFee = consultationFee;
    }

    public void Activate() => Status = DoctorStatus.Active;

    public void Suspend() => Status = DoctorStatus.Suspended;
}