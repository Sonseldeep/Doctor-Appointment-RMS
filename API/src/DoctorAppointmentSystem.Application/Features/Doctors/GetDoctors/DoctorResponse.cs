using DoctorAppointmentSystem.Domain.Doctor;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

public sealed record DoctorResponse(
    Guid DoctorProfileId,
    Guid UserId,
    string FirstName,
    string LastName,
    string? ProfilePhotoUrl,
    string NmcNumber,
    Specialization Specialization,
    decimal ConsultationFee,
    string Bio,
    decimal AverageRating,
    int TotalRatings  
);