using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;

public sealed record AppointmentResponse(
    Guid Id,
    Guid PatientUserId,
    Guid DoctorUserId,
    DateTimeOffset StartUtc,
    DateTimeOffset EndUtc,
    AppointmentStatus Status,
    string? Notes,
    string DoctorName,
    string DoctorNmcNumber,
    Specialization DoctorSpecialization,
    string PatientName,
    Sex? PatientSex,
    int? PatientAge
);