using System;

namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IUserContext
{
    Guid UserId { get; }
    string IpAddress { get; }
    string Role { get; }
    Guid? PatientProfileId { get; }
    Guid? DoctorProfileId { get; }
}