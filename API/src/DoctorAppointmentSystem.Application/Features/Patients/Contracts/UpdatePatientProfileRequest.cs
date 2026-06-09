using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Features.Patients.Contracts;

public sealed record UpdatePatientProfileRequest(
    string? PhoneNumber,
    string? Address,
    Sex Sex,
    DateOnly DateOfBirth);