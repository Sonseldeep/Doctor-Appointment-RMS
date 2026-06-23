using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Domain.Labs;
using DoctorAppointmentSystem.Domain.Notifications;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;

public class ReceiveLabPayloadCommandHandler : ICommandHandler<ReceiveLabPayloadCommand>
{
    private readonly ILabReportRepository _labRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly INotificationRepository _notificationRepository;

    public ReceiveLabPayloadCommandHandler(
        ILabReportRepository labRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        INotificationRepository notificationRepository)
    {
        _labRepository = labRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _notificationRepository = notificationRepository;
    }

    public async Task<ErrorOr<Success>> Handle(ReceiveLabPayloadCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.PatientEmail, cancellationToken);

        if (user == null)
            return Error.NotFound("Lab.PatientNotFound", "Patient verification context failed.");

        var report = LabReport.Create(user.Id, request.LabName, request.PanelName, request.ObservationDate);

        foreach (var obs in request.Observations)
        {
            report.AddObservation(obs.TestName, obs.Value, obs.Unit, obs.ReferenceRange, obs.IsAbnormal);
        }

        await _labRepository.AddAsync(report, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // We pass 'null' for the 5th argument here to ensure positional parameters align perfectly.
        // If you want to link the report ID and it's strongly typed, use 'report.Id.Value' instead of 'null'.
        var notification = Notification.Create(
            user.Id,
            "Lab Report Ready",
            $"Your lab results for {request.PanelName} are now ready.",
            NotificationType.LabReportReady,
            report.Id);

        await _notificationRepository.AddAsync(notification, cancellationToken); // Save to DB

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.SendToUserAsync(
            user.Id,
            notification,
            cancellationToken);

        return Result.Success;
    }
}