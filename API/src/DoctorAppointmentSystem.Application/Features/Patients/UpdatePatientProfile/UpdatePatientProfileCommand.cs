using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Features.Patients.UpdatePatientProfile;

public sealed record UpdatePatientProfileCommand(
    Guid UserId,
    string? PhoneNumber,
    string? Address,
    Sex Sex,
    DateOnly DateOfBirth
) : ICommand;