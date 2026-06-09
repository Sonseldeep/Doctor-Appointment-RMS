using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;


public sealed record GetAllDoctorsQuery(
    int Page,
    int PageSize,
    string? SearchTerm,
    Specialization? Specialization,
    DoctorStatus? Status
) : IQuery<PagedResult<AdminDoctorResponse>>;