using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Features.Patients.GetPatientMe;

public sealed record PatientMeResponse(
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    string? ProfilePhotoUrl,
    Sex Sex,
    string? PhoneNumber,
    string? Address
);