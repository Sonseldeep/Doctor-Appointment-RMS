using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Availability;
using ErrorOr;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Availability.DeleteAvailability;


public sealed record DeleteAvailabilityCommand(
    Guid DoctorUserId,
    Guid AvailabilityId
) : ICommand;




