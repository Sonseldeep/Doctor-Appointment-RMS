using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Patients.GetPatientMe;

public sealed record GetPatientMeQuery(Guid UserId)
    : IQuery<PatientMeResponse>;