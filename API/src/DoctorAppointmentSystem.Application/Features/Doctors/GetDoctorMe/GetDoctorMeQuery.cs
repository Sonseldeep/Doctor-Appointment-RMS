using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Contract;

namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctorMe;

public sealed record GetDoctorMeQuery(Guid UserId) : IQuery<DoctorDetailsResponse>;