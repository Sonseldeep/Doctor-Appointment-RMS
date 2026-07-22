using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Application.Features.Doctors.Contract;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorByUserId;

public sealed record GetDoctorByUserIdQuery(Guid UserId) 
    : IQuery<DoctorDetailsResponse>;