namespace DoctorAppointmentSystem.Api.Common.Request;

public sealed record UpdateRatingRequest(int Stars, string? Comment);
