using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;

public sealed record GetAllPatientsQuery(
    int Page,
    int PageSize,
    string? SearchTerm,
    Sex? Sex,
    int? MinAge,
    int? MaxAge,
    string? Address
    ) : IQuery<PagedResult<AdminPatientResponse>> ;
