using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Ratings;

public class DoctorRating : Entity
{
    private DoctorRating()
    {
        
    }
    
    private DoctorRating(
        Guid doctorUserId,
        Guid patientUserId,
        int stars,
        string? comment)
        : base(Guid.NewGuid())
    {
        DoctorUserId = doctorUserId;
        PatientUserId = patientUserId;
        Stars = stars;
        Comment = comment;
        CreatedAtUtc = DateTimeOffset.UtcNow;
        UpdatedAtUtc = DateTimeOffset.UtcNow;
    }


    public Guid DoctorUserId { get; private set; }
    
    public Guid PatientUserId { get; private set; }
    
    public int Stars { get; private set; }
    
    public string? Comment { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public DateTimeOffset UpdatedAtUtc { get; private set; }



    public static DoctorRating Create(
        Guid doctorUserId,
        Guid patientUserId,
        int stars,
        string? comment)
    {
        return new DoctorRating(doctorUserId, patientUserId, stars, comment);
    }
       

    
    public int Update(int stars, string? comment)
    {
        var oldStars = Stars;
        Stars = stars;
        Comment = comment;
        UpdatedAtUtc = DateTimeOffset.UtcNow;
        return oldStars;
    }
    
}