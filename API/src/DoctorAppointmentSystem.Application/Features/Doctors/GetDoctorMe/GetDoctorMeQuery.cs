using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorMe;

public sealed record GetDoctorMeQuery(Guid UserId) : IQuery<DoctorDetailsResponse>;