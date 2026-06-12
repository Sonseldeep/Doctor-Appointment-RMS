using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Ratings.UpdateRating;

public sealed record UpdateRatingCommand(
    Guid PatientUserId,
    Guid RatingId,
    int Stars,
    string? Comment) : ICommand;