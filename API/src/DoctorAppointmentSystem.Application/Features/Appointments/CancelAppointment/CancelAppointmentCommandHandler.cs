using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.CancelAppointment;

internal sealed class CancelAppointmentCommandHandler : ICommandHandler<CancelAppointmentCommand>
{
    private readonly IAppointmentRepository _appointments;
    private readonly IDoctorAvailabilityRepository _availability;
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;

    public CancelAppointmentCommandHandler(
        IAppointmentRepository appointments,
        IDoctorAvailabilityRepository availability,
        IUserRepository users,
        IUnitOfWork uow)
    {
        _appointments = appointments;
        _availability = availability;
        _users = users;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(
        CancelAppointmentCommand request,
        CancellationToken cancellationToken)
    {
        var appointment = await _appointments.GetByIdAsync(request.AppointmentId, cancellationToken);
        if (appointment is null) return AppointmentErrors.NotFound;

        var user = await _users.GetByIdAsync(request.PatientUserId, cancellationToken);
        if (user is null) return UserErrors.NotFound;

        var isOwner = appointment.PatientUserId == request.PatientUserId
                      || appointment.DoctorUserId == request.PatientUserId;
        if (!isOwner) return AppointmentErrors.Forbidden;

        appointment.Cancel(DateTimeOffset.UtcNow);

        var slot = await _availability.GetSlotByAppointmentIdAsync(
            appointment.Id, cancellationToken);
        slot?.Release();

        await _uow.SaveChangesAsync(cancellationToken);
        return Result.Success;
    }
}