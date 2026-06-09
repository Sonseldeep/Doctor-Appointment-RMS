using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;

public sealed record GetAllDoctorsRequest(
    int Page = 1,
    int PageSize = 20,
    string? SearchTerm = null,   
    Specialization? Specialization = null,
    DoctorStatus? Status = null);