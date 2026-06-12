using ErrorOr;

namespace DoctorAppointmentSystem.Domain.Ratings;

public static class RatingErrors
{
    public static readonly Error AlreadyRated = Error.Conflict(
        "Rating.AlreadyRated",
        "You have already submitted a rating for this doctor.");

    public static readonly Error NotFound = Error.NotFound(
        "Rating.NotFound",
        "Rating was not found.");

    public static readonly Error Forbidden = Error.Forbidden(
        "Rating.Forbidden",
        "You are not allowed to modify this rating.");

    public static readonly Error NoCompletedAppointment = Error.Validation(
        "Rating.NoCompletedAppointment",
        "You can only rate a doctor after completing an appointment with them.");

    public static readonly Error InvalidStars = Error.Validation(
        "Rating.InvalidStars",
        "Stars must be between 1 and 5.");
}