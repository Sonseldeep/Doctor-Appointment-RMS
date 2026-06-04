using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

public sealed record GetDoctorsQuery() : 
    IQuery<IReadOnlyList<DoctorResponse>>;