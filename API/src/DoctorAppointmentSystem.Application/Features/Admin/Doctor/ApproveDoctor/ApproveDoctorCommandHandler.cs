using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Notifications;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.ApproveDoctor;

internal sealed class ApproveDoctorCommandHandler : ICommandHandler<ApproveDoctorCommand>
{
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IUnitOfWork _uow;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public ApproveDoctorCommandHandler(
        IDoctorProfileRepository doctorProfiles,
        IUnitOfWork uow,
        INotificationService notificationService,
        INotificationRepository notificationsRepository)
    {
        _doctorProfiles = doctorProfiles;
        _uow = uow;
        _notificationService = notificationService;
        _notificationRepository = notificationsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(
        ApproveDoctorCommand request,
        CancellationToken cancellationToken)
    {
        var profile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        if (profile is null)
        {
            return DoctorErrors.ProfileMissing;
        }

        profile.Activate();
        
        var notification = Notification.Create(
            userId: profile.UserId,
            title: "Account Approved",
            message: "Your doctor profile has been approved. You can now receive appointments.",
            type: NotificationType.DoctorApproved);
        
        await _notificationRepository.AddAsync(notification, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);
        await _notificationService.SendToUserAsync(profile.UserId, notification, cancellationToken);

        return Result.Success;
    }
}