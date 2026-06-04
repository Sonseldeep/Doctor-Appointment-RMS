using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.UpdateDoctorProfile;

public sealed record UpdateDoctorProfileCommand(
    Guid UserId,  // doctor user id (from token)
    string Bio,
    Specialization Specialization,
    decimal ConsultationFee
) : ICommand;