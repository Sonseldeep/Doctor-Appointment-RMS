using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;


public sealed record GetMyAppointmentsQuery(Guid UserId) 
    : IQuery<IReadOnlyList<AppointmentResponse>>;