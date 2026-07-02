using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

public sealed record TopRatedDoctorResponse(
    Guid DoctorUserId,
    string DoctorName,
    Specialization Specialization,
    decimal AverageRating,
    int TotalRatings);