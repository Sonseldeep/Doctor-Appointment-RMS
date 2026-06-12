namespace DoctorAppointmentSystem.Application.Features.Ratings.Contracts;

public sealed record RatingResponse(
    Guid Id,
    Guid DoctorUserId,
    Guid PatientUserId,
    int Stars,
    string? Comment,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset UpdatedAtUtc);