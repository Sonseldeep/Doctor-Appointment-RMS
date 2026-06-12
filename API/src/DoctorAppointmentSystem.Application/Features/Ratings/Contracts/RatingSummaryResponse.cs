namespace DoctorAppointmentSystem.Application.Features.Ratings.Contracts;

public sealed record RatingSummaryResponse(
    Guid DoctorUserId,
    decimal AverageRating,
    int TotalRatings);
