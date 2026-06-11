using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Abstractions.Appointments;

public sealed record AppointmentWithDetailsDto(
    Guid Id,
    Guid PatientUserId,
    Guid DoctorUserId,
    DateTimeOffset StartUtc,
    DateTimeOffset EndUtc,
    AppointmentStatus Status,
    string? Notes,
    string DoctorFirstName,
    string DoctorLastName,
    string DoctorNmcNumber,
    string? DoctorPhotoUrl,
    Specialization DoctorSpecialization,
    string PatientFirstName,
    string PatientLastName,
    Sex PatientSex,
    int PatientAge,
    string? PatientPhotoUrl 
);