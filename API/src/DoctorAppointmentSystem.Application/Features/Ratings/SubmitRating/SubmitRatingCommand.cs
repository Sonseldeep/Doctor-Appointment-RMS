using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Ratings.SubmitRating;

public sealed record SubmitRatingCommand(
    Guid PatientUserId,
    Guid DoctorUserId,
    int Stars,
    string? Comment) : ICommand<Guid>;
