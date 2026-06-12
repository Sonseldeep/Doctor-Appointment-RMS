using DoctorAppointmentSystem.Application.Features.Ratings.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Ratings.GetDoctorRating;


public sealed record GetDoctorRatingsResponse(
    RatingSummaryResponse Summary, 
    IReadOnlyList<RatingResponse> Ratings);