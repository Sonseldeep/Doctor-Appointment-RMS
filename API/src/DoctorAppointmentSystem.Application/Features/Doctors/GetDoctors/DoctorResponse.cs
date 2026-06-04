using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

public sealed record DoctorResponse(
    Guid DoctorProfileId,
    Guid UserId,
    Specialization Specialization,
    decimal ConsultationFee,
    DoctorStatus Status,
    string Bio
);