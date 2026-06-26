namespace DoctorAppointmentSystem.Application.Features.Doctors.Patients.SearchPatients;

public record PatientSearchResponse(
    Guid Id,
    string Name,
    string Email,
    DateTime DateOfBirth);