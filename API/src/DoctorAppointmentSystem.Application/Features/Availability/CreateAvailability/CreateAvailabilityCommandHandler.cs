using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Domain.Availability;
using DoctorAppointmentSystem.Domain.Doctor;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Availability.CreateAvailability;

internal sealed class CreateAvailabilityCommandHandler
    : ICommandHandler<CreateAvailabilityCommand, Guid>
{
    private readonly IDoctorAvailabilityRepository _availability;
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;

    public CreateAvailabilityCommandHandler(
        IDoctorAvailabilityRepository availability,
        IDoctorProfileRepository doctorProfiles,
        IUserRepository users,
        IUnitOfWork uow)
    {
        _availability = availability;
        _doctorProfiles = doctorProfiles;
        _users = users;
        _uow = uow;
    }

    public async Task<ErrorOr<Guid>> Handle(
        CreateAvailabilityCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.DoctorUserId, cancellationToken);
        if (user is null)
        {
            return DoctorErrors.UserIsNotDoctor;
        }

        var profile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        var access = DoctorAccessGuards.EnsureApprovedForDoctorActions(user, profile);
        if (access.IsError)
        {
            return access.Errors;
        }

        var exists = await _availability.ExistsForDoctorOnDateAsync(
            request.DoctorUserId, request.Date, cancellationToken);
        if (exists)
        {
            return AvailabilityErrors.DuplicateDate;
        }

        var result = DoctorAvailability.Create(
            request.DoctorUserId,
            request.Date,
            request.StartTime,
            request.EndTime,
            request.SlotDurationMinutes);

        if (result.IsError)
        {
            return result.Errors;
        }

        await _availability.AddAsync(result.Value, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        return result.Value.Id;
    }
}
