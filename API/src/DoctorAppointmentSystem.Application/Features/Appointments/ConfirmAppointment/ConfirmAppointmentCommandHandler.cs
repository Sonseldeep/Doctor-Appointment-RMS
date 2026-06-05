using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.ConfirmAppointment;

internal sealed class ConfirmAppointmentCommandHandler
    : ICommandHandler<ConfirmAppointmentCommand>
{
    private readonly IAppointmentRepository _appointments;
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;
    private readonly IDateTimeProvider _clock;
    private readonly IDoctorProfileRepository _doctorProfiles;

    public ConfirmAppointmentCommandHandler(
        IAppointmentRepository appointments,
        IUserRepository users,
        IUnitOfWork uow,
        IDateTimeProvider clock, IDoctorProfileRepository doctorProfiles)
    {
        _appointments = appointments;
        _users = users;
        _uow = uow;
        _clock = clock;
        _doctorProfiles = doctorProfiles;
    }

    public async Task<ErrorOr<Success>> Handle(ConfirmAppointmentCommand request, CancellationToken cancellationToken)
    {
        var doctor = await _users.GetByIdAsync(request.DoctorUserId, cancellationToken);
        
        if (doctor is null)
        {
            return UserErrors.NotFound;
        }
        
        var profile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        var approval = DoctorAccessGuards.EnsureApprovedForDoctorActions(doctor, profile);
        
        if (approval.IsError)
        {
            return approval.Errors;
        }

        var appointment = await _appointments.GetByIdAsync(request.AppointmentId, cancellationToken);
        if (appointment is null)
        {
            return AppointmentErrors.NotFound;
        }
           
        if (appointment.DoctorUserId != request.DoctorUserId)
        {
            return AppointmentErrors.Forbidden;
        }

        try
        {
            appointment.Confirm(_clock.UtcNow);
        }
        catch
        {
            return AppointmentErrors.InvalidStatus;
        }

        await _uow.SaveChangesAsync(cancellationToken);
        return Result.Success;
    }
}