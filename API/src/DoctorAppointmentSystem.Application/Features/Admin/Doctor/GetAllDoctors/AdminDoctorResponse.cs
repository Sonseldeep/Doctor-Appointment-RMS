using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;

public sealed record AdminDoctorResponse(
    Guid UserId,
    Guid DoctorProfileId,
    string FirstName,
    string LastName,
    string Email,
    string? ProfilePhotoUrl,
    Specialization Specialization,
    decimal ConsultationFee,
    DoctorStatus Status,
    string Bio,
    DateTimeOffset CreatedAtUtc);