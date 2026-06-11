using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.CompleteAppointment;

internal sealed class CompleteAppointmentCommandHandler
    : ICommandHandler<CompleteAppointmentCommand>
{
    private readonly IAppointmentRepository _appointments;
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;
    private readonly IDateTimeProvider _clock;
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;


    public CompleteAppointmentCommandHandler(
        IAppointmentRepository appointments,
        IUserRepository users,
        IUnitOfWork uow,
        IDateTimeProvider clock,
        IDoctorProfileRepository doctorProfiles, 
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _appointments = appointments;
        _users = users;
        _uow = uow;
        _clock = clock;
        _doctorProfiles = doctorProfiles;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
    }

    public async Task<ErrorOr<Success>> Handle(CompleteAppointmentCommand request, CancellationToken cancellationToken)
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
            appointment.Complete(_clock.UtcNow);
        }
        catch
        {
            return AppointmentErrors.InvalidStatus;
        }
        

        var doctorName = $"Dr. {doctor.FirstName} {doctor.LastName}";
        var appointmentDate = $"{appointment.StartUtc:dd MMM yyyy} at {appointment.StartUtc:HH:mm} UTC";

        var patientNotification = Notification.Create(
            userId: appointment.PatientUserId,
            title: "Appointment Completed",
            message: $"Your appointment with {doctorName} on {appointmentDate} has been marked as completed.",
            type: NotificationType.AppointmentCompleted,
            appointmentId: appointment.Id);

        await _notificationRepository.AddAsync(patientNotification, cancellationToken);

        await _uow.SaveChangesAsync(cancellationToken);

        await _notificationService.SendToUserAsync(appointment.PatientUserId, patientNotification, cancellationToken);
        return Result.Success;
    }
}