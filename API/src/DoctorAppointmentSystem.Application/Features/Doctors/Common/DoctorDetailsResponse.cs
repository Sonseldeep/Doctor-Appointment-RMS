using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Common;

public sealed record DoctorDetailsResponse(
    Guid DoctorProfileId,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    string? ProfilePhotoUrl,
    Specialization Specialization,
    decimal ConsultationFee,
    DoctorStatus Status,
    string Bio
);