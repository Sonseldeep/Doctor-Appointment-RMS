using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.CancelAppointment;

internal sealed class CancelAppointmentCommandHandler : ICommandHandler<CancelAppointmentCommand>
{
    private readonly IAppointmentRepository _appointments;
    private readonly IDoctorAvailabilityRepository _availability;
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public CancelAppointmentCommandHandler(
        IAppointmentRepository appointments,
        IDoctorAvailabilityRepository availability,
        IUserRepository users,
        IUnitOfWork uow, 
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _appointments = appointments;
        _availability = availability;
        _users = users;
        _uow = uow;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
    }

    public async Task<ErrorOr<Success>> Handle(
        CancelAppointmentCommand request,
        CancellationToken cancellationToken)
    {
        var appointment = await _appointments.GetByIdAsync(request.AppointmentId, cancellationToken);
        if (appointment is null)
        {
            return AppointmentErrors.NotFound;
        }

        var user = await _users.GetByIdAsync(request.PatientUserId, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }

        var isOwner = appointment.PatientUserId == request.PatientUserId
                      || appointment.DoctorUserId == request.PatientUserId;
        if (!isOwner)
        {
            return AppointmentErrors.Forbidden;
        }
        
        var cancelledByDoctor = appointment.DoctorUserId == request.PatientUserId;


        appointment.Cancel(DateTimeOffset.UtcNow);

        var slot = await _availability.GetSlotByAppointmentIdAsync(
            appointment.Id, cancellationToken);
        slot?.Release();

        var appointmentDate = $"{appointment.StartUtc:dd MMM yyyy} at {appointment.StartUtc:HH:mm} UTC";
        const string newStatus = nameof(AppointmentStatus.Cancelled);
        
        
        if (cancelledByDoctor)
        {
            var doctorName = $"Dr. {user.FirstName} {user.LastName}";

            var patientNotification = Notification.Create(
                userId: appointment.PatientUserId,
                title: "Appointment Cancelled",
                message: $"Your appointment with {doctorName} on {appointmentDate} has been cancelled by the doctor.",
                type: NotificationType.AppointmentCancelled,
                appointmentId: appointment.Id);

            await _notificationRepository.AddAsync(patientNotification, cancellationToken);
            await _uow.SaveChangesAsync(cancellationToken);
            
            await _notificationService.SendToUserAsync(appointment.PatientUserId, patientNotification, cancellationToken);
        }
        else
        {
            var patientName = $"{user.FirstName} {user.LastName}";

            var doctorNotification = Notification.Create(
                userId: appointment.DoctorUserId,
                title: "Appointment Cancelled",
                message: $"Patient {patientName} has cancelled their appointment on {appointmentDate}.",
                type: NotificationType.AppointmentCancelled,
                appointmentId: appointment.Id);

            await _notificationRepository.AddAsync(doctorNotification, cancellationToken);
            await _uow.SaveChangesAsync(cancellationToken);
            
            await _notificationService.SendToUserAsync(appointment.DoctorUserId, doctorNotification, cancellationToken);
        }
        
        await _notificationService.SendAppointmentStatusChangedAsync(
            appointment.PatientUserId, appointment.Id, newStatus, cancellationToken);
        
        await _uow.SaveChangesAsync(cancellationToken);

        await _notificationService.SendAppointmentStatusChangedAsync(
            appointment.DoctorUserId, appointment.Id, newStatus, cancellationToken);
        
        return Result.Success;
    }
}