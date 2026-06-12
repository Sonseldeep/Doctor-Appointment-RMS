namespace DoctorAppointmentSystem.Api.Common.Request;

public sealed record SubmitRatingRequest(int Stars, string? Comment);
