using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Ratings.GetDoctorRating;

public sealed record GetDoctorRatingsQuery(Guid DoctorUserId) 
    : IQuery<GetDoctorRatingsResponse>;
