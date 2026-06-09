using DoctorAppointmentSystem.Domain.Patients;

namespace DoctorAppointmentSystem.Application.Features.Admin.Patient.Contracts;

public sealed record GetAllPatientsRequest(
    int Page = 1,
    int PageSize = 20,
    string? SearchTerm = null,
    Sex? Sex = null,
    int? MinAge = null,
    int? MaxAge = null,
    string? Address = null);