using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Notifications;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.SuspendDoctor;

internal sealed class SuspendDoctorCommandHandler : ICommandHandler<SuspendDoctorCommand>
{
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IUnitOfWork _uow;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public SuspendDoctorCommandHandler(
        IDoctorProfileRepository doctorProfiles,
        IUnitOfWork uow,
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _doctorProfiles = doctorProfiles;
        _uow = uow;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
    }

    public async Task<ErrorOr<Success>> Handle(
        SuspendDoctorCommand request,
        CancellationToken cancellationToken)
    {
        var profile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        if (profile is null)
        {
            return DoctorErrors.ProfileMissing;
        }
        
        profile.Suspend();
        
        var notification = Notification.Create(
            userId: profile.UserId,
            title: "Account Suspended",
            message: "Your doctor account has been suspended by the administrator. Please contact support for more information.",
            type: NotificationType.DoctorSuspended);
        
        await _notificationRepository.AddAsync(notification, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);
        await _notificationService.SendToUserAsync(profile.UserId, notification, cancellationToken);

        return Result.Success;
    }
}