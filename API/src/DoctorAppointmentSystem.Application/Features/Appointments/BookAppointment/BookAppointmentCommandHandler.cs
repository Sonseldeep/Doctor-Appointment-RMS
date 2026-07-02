using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Jobs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Features.Appointments.Contracts;
using DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Availability;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;

internal sealed class BookAppointmentCommandHandler
    : ICommandHandler<BookAppointmentCommand, BookAppointmentResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IDoctorAvailabilityRepository _availability;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IAppointmentScheduler _scheduler;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;



    public BookAppointmentCommandHandler(
        IUserRepository userRepository,
        IAppointmentRepository appointmentRepository,
        IDoctorAvailabilityRepository availability,
        IUnitOfWork unitOfWork,
        IDoctorProfileRepository doctorProfiles,
        IAppointmentScheduler scheduler,
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _userRepository = userRepository;
        _appointmentRepository = appointmentRepository;
        _availability = availability;
        _unitOfWork = unitOfWork;
        _doctorProfiles = doctorProfiles;
        _scheduler = scheduler;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
    }

    public async Task<ErrorOr<BookAppointmentResponse>> Handle(
        BookAppointmentCommand request,
        CancellationToken cancellationToken)
    {
       
        var patient = await _userRepository.GetByIdAsync(request.PatientUserId, cancellationToken);
        
        if (patient is null)
        {
            return UserErrors.NotFound;
        }
        if (patient.Role != UserRole.Registered)
        {
            return AppointmentErrors.Forbidden;
        }
        if (!patient.IsEmailVerified)
        {
            return UserErrors.NotVerified;
        }

        var doctorUser = await _userRepository.GetByIdAsync(request.DoctorUserId, cancellationToken);
        if (doctorUser is null)
        {
            return UserErrors.NotFound;
        }

        var doctorProfile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        var access = DoctorAccessGuards.EnsureApprovedForPublicView(doctorUser, doctorProfile);
        if (access.IsError)
        {
            return access.Errors;
        }

        var slot = await _availability.GetSlotWithAvailabilityAsync(request.SlotId, cancellationToken);
        if (slot is null)
        {
            return AvailabilityErrors.SlotNotFound;
        }

        if (slot.Availability.DoctorUserId != request.DoctorUserId)
        {
            return AvailabilityErrors.SlotBelongsToDifferentDoctor;
        }

       
        var date = slot.Availability.Date;
        var startUtc = new DateTimeOffset(
            date.Year, date.Month, date.Day,
            slot.StartTime.Hour, slot.StartTime.Minute, 0,
            TimeSpan.Zero); 

        var endUtc = new DateTimeOffset(
            date.Year, date.Month, date.Day,
            slot.EndTime.Hour, slot.EndTime.Minute, 0,
            TimeSpan.Zero);

        if (startUtc < DateTimeOffset.UtcNow)
        {
            return AppointmentErrors.CannotBookInPast;
        }

        var overlap = await _appointmentRepository.DoctorHasOverlapAsync(
            request.DoctorUserId, startUtc, endUtc, cancellationToken);
        if (overlap)
        {
            return AppointmentErrors.SlotNotAvailable;
        }

        var patientOverlap = await _appointmentRepository.PatientHasOverlapAsync(
            request.PatientUserId, startUtc, endUtc, cancellationToken);
        if (patientOverlap)
        {
            return AppointmentErrors.PatientSlotConflict;
        }

        
        var appointment = Appointment.Create(
            request.PatientUserId,
            request.DoctorUserId,
            startUtc,
            endUtc,
            request.Notes);

        await _appointmentRepository.AddAsync(appointment, cancellationToken);

        var bookResult = slot.Book(appointment.Id);
        if (bookResult.IsError)
        {
            return bookResult.Errors;
        }
        
        var doctorName = $"Dr. {doctorUser.FirstName} {doctorUser.LastName}";
        var patientName = $"{patient.FirstName} {patient.LastName}";
        var appointmentDate = $"{date:dd MMM yyyy} at {slot.StartTime:HH:mm}";

        var patientNotification = Notification.Create(
            userId: request.PatientUserId,
            title: "Appointment Booked",
            message: $"Your appointment with {doctorName} on {appointmentDate} has been booked and is pending confirmation.",
            type: NotificationType.AppointmentBooked,
            appointmentId: appointment.Id);

        var doctorNotification = Notification.Create(
            userId: request.DoctorUserId,
            title: "New Appointment Request",
            message: $"{patientName} has booked an appointment on {appointmentDate}. Please confirm or cancel.",
            type: NotificationType.AppointmentBooked,
            appointmentId: appointment.Id);

        await _notificationRepository.AddAsync(patientNotification, cancellationToken);
        await _notificationRepository.AddAsync(doctorNotification, cancellationToken);
        
        

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        await _notificationService.SendToUserAsync(request.PatientUserId, patientNotification, cancellationToken);
        await _notificationService.SendToUserAsync(request.DoctorUserId, doctorNotification, cancellationToken);

        var appointmentPayload = new AppointmentResponse(
            appointment.Id,
            appointment.PatientUserId,
            appointment.DoctorUserId,
            appointment.StartUtc,
            appointment.EndUtc,
            appointment.Status,
            appointment.Notes,
            doctorName,
            doctorProfile!.NmcNumber,
            doctorUser.ProfilePhotoUrl,
            doctorProfile.Specialization,
            patientName,
            null,
            null,
            patient.ProfilePhotoUrl);

        await _notificationService.SendAppointmentBookedToDoctorAsync(
            request.DoctorUserId, appointmentPayload, cancellationToken);



        _scheduler.ScheduleReminders(appointment.Id, appointment.StartUtc);

        var response = new BookAppointmentResponse(
            AppointmentId: appointment.Id,
            Status: appointment.Status.ToString(),
            Message: $"Appointment booked successfully for {date:dd MMM yyyy} at {slot.StartTime:HH:mm}.");
        


        return response;
    }
}
