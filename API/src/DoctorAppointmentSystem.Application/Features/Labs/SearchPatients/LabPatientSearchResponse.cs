namespace DoctorAppointmentSystem.Application.Features.Labs.SearchPatients;

public sealed record LabPatientSearchResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? ProfilePhotoUrl,
    DateTime DateOfBirth);