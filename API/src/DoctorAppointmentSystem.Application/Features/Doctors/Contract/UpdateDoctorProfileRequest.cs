using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Contract;

public sealed record UpdateDoctorProfileRequest(
    string Bio,
    Specialization Specialization,
    decimal ConsultationFee);