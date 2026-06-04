using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.CreateDoctorProfile;

public sealed record CreateDoctorProfileCommand(
    Guid UserId,
    string Bio,
    Specialization Specialization,
    decimal ConsultationFee
) : ICommand<Guid>;