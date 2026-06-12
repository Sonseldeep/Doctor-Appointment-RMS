using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Ratings.DeleteRating;

public sealed record DeleteRatingCommand(
    Guid PatientUserId,
    Guid RatingId) : ICommand;
