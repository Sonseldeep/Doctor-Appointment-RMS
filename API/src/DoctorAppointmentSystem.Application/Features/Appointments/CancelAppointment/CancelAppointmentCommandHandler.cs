using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.CancelAppointment;

internal sealed class CancelAppointmentCommandHandler
    : ICommandHandler<CancelAppointmentCommand>
{
    private readonly IAppointmentRepository _appointments;
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;
    private readonly IDateTimeProvider _clock;

    public CancelAppointmentCommandHandler(
        IAppointmentRepository appointments,
        IUserRepository users,
        IUnitOfWork uow,
        IDateTimeProvider clock)
    {
        _appointments = appointments;
        _users = users;
        _uow = uow;
        _clock = clock;
    }

    public async Task<ErrorOr<Success>> Handle(CancelAppointmentCommand request, CancellationToken cancellationToken)
    {
        var patient = await _users.GetByIdAsync(request.PatientUserId, cancellationToken);
        if (patient is null) return UserErrors.NotFound;
        if (patient.Role != UserRole.Registered) return AppointmentErrors.Forbidden;

        var appointment = await _appointments.GetByIdAsync(request.AppointmentId, cancellationToken);
        if (appointment is null) return AppointmentErrors.NotFound;

        if (appointment.PatientUserId != request.PatientUserId)
            return AppointmentErrors.Forbidden;

        try
        {
            appointment.Cancel(_clock.UtcNow);
        }
        catch
        {
            return AppointmentErrors.InvalidStatus;
        }

        await _uow.SaveChangesAsync(cancellationToken);
        return Result.Success;
    }
}