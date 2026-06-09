using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;

public sealed record AdminPatientResponse(
    Guid UserId,
    Guid PatientProfileId,
    string FirstName,
    string LastName,
    string Email,
    string? ProfilePhotoUrl,
    Sex Sex,
    int? Age,
    string? PhoneNumber,
    string? Address,
    DateTimeOffset CreatedAtUtc);