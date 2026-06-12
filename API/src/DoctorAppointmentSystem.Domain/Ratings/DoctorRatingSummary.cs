using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Ratings;

public sealed class DoctorRatingSummary : Entity
{
    private DoctorRatingSummary() { }

    private DoctorRatingSummary(Guid doctorUserId)
        : base(Guid.NewGuid())
    {
        DoctorUserId = doctorUserId;
        TotalRatings = 0;
        RatingSum = 0;
        LastUpdatedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid DoctorUserId { get; private set; }

    public int TotalRatings { get; private set; }

    public int RatingSum { get; private set; }

    public decimal AverageRating => TotalRatings == 0
        ? 0m
        : Math.Round((decimal)RatingSum / TotalRatings, 1);

    public DateTimeOffset LastUpdatedAtUtc { get; private set; }

    public static DoctorRatingSummary CreateEmpty(Guid doctorUserId)
        => new(doctorUserId);

    public void AddRating(int stars)
    {
        TotalRatings++;
        RatingSum += stars;
        LastUpdatedAtUtc = DateTimeOffset.UtcNow;
    }

 
    public void UpdateRating(int oldStars, int newStars)
    {
        RatingSum = RatingSum - oldStars + newStars;
        LastUpdatedAtUtc = DateTimeOffset.UtcNow;
    }

    public void RemoveRating(int stars)
    {
        if (TotalRatings == 0)
        {
            return;
        }
        
        TotalRatings--;
        RatingSum -= stars;
        LastUpdatedAtUtc = DateTimeOffset.UtcNow;
    }
}