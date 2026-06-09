using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

public sealed record GetDoctorsQuery(
    int Page,
    int PageSize,
    string? SearchTerm,
    Specialization? Specialization
) : IQuery<PagedResult<DoctorResponse>>;