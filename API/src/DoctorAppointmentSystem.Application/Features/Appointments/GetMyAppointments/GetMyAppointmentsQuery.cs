using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;

namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;

public sealed record GetMyAppointmentsQuery(
    Guid UserId,
    int Page,
    int PageSize) : IQuery<PagedResult<AppointmentResponse>>;