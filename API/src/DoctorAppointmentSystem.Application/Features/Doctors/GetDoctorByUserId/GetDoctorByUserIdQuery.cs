using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorByUserId;

public sealed record GetDoctorByUserIdQuery(Guid UserId) : IQuery<DoctorDetailsResponse>;