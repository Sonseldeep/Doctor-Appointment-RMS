using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

public sealed record GetDoctorsRequest(
    int Page = 1,
    int PageSize = 20,
    string? SearchTerm = null,      
    Specialization? Specialization = null);