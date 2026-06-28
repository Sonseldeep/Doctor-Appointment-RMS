//using DoctorAppointmentSystem.Application.Abstractions.Messaging;

//namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;


//public sealed record GetMyAppointmentsQuery(
//    Guid UserId,
//    int Page,
//    int PageSize) 
//    : IQuery<IReadOnlyList<AppointmentResponse>>;

using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;

namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;

// Ensure this uses PagedResult, NOT IReadOnlyList
public sealed record GetMyAppointmentsQuery(
    Guid UserId,
    int Page,
    int PageSize) : IQuery<PagedResult<AppointmentResponse>>;