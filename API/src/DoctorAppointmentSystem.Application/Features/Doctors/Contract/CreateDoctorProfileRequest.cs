using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.Contract;

public sealed record CreateDoctorProfileRequest(
    string NmcNumber,
    string Bio,
    Specialization Specialization,
    decimal ConsultationFee);