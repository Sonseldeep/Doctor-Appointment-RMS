using System;

namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IUserContext
{
    Guid UserId { get; }
    string IpAddress { get; }
}