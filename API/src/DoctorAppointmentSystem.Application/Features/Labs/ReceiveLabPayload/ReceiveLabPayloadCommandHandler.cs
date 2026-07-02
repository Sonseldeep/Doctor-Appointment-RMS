using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Abstractions.Storage;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
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
    private readonly IFileStorageService _fileStorageService; 

    public ReceiveLabPayloadCommandHandler(
        ILabReportRepository labRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        INotificationRepository notificationRepository,
        IFileStorageService fileStorageService) 
    {
        _labRepository = labRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _notificationRepository = notificationRepository;
        _fileStorageService = fileStorageService;
    }

    public async Task<ErrorOr<Success>> Handle(ReceiveLabPayloadCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.PatientEmail, cancellationToken);

        if (user is null)
        {
            return Error.NotFound("Lab.PatientNotFound", "Patient verification context failed.");
        }
        var report = LabReport.Create(user.Id, request.LabName, request.PanelName, request.ObservationDate);

        

        foreach (var obs in request.Observations)
        {
            
            report.AddObservation(obs.TestName, obs.Value, obs.Unit, obs.ReferenceRange, obs.IsAbnormal);
        }

        if (request.Document is not null && request.Document.Length > 0)
        {
            var documentUrl = await _fileStorageService.UploadAsync(
                request.Document.Content,
                request.Document.FileName,
                request.Document.ContentType,
                cancellationToken);
            
            var mimeType = request.Document.ContentType;
            
            var documentType = mimeType.StartsWith("image/") ? "XRAY" : "PDF";

            report.AttachDocument(documentUrl, documentType, mimeType);
        }
        

        await _labRepository.AddAsync(report, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        var reportPayload = new LabReportResponse(
            report.Id,
            report.LabName,
            report.PanelName,
            report.ObservationDateTime,
            report.DocumentUrl,
            report.DocumentType,
            report.MimeType,
            report.Observations.Select(o => new ObservationResponse(
                o.TestName,
                o.Value,
                o.Unit,
                o.ReferenceRange,
                o.IsAbnormal)).ToList());

        await _notificationService.SendLabReportAddedToPatientAsync(
            user.Id,
            reportPayload,
            cancellationToken);

        var notification = Notification.Create(
            user.Id,
            "Lab Report Ready",
            $"Your lab results for {request.PanelName} are now ready.",
            NotificationType.LabReportReady,
            report.Id);

        await _notificationRepository.AddAsync(notification, cancellationToken); 
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.SendToUserAsync(user.Id, notification, cancellationToken);
        
        await _notificationService.NotifyDashboardStatsChangedAsync("lab-report-added", cancellationToken);

        return Result.Success;
    }
}