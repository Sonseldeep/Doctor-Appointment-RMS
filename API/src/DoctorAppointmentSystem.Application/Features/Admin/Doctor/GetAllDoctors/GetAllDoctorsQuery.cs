using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;

public sealed record GetAllDoctorsQuery : IQuery<IReadOnlyList<AdminDoctorResponse>>;