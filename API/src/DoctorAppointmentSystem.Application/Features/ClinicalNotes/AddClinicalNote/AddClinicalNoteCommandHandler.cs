using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Common;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.ClinicalNotes;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.AddClinicalNote;

internal sealed class AddClinicalNoteCommandHandler
    : ICommandHandler<AddClinicalNoteCommand, ClinicalNoteResponse>
{
    private readonly IAppointmentRepository _appointments;
    private readonly IClinicalNoteRepository _clinicalNotes;
    private readonly IUserRepository _users;
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IUnitOfWork _uow;
    private readonly IDateTimeProvider _clock;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public AddClinicalNoteCommandHandler(
        IAppointmentRepository appointments,
        IClinicalNoteRepository clinicalNotes,
        IUserRepository users,
        IDoctorProfileRepository doctorProfiles,
        IUnitOfWork uow,
        IDateTimeProvider clock,
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _appointments = appointments;
        _clinicalNotes = clinicalNotes;
        _users = users;
        _doctorProfiles = doctorProfiles;
        _uow = uow;
        _clock = clock;
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
    }

    public async Task<ErrorOr<ClinicalNoteResponse>> Handle(AddClinicalNoteCommand request, CancellationToken cancellationToken)
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

        if (appointment.Status != AppointmentStatus.Completed)
        {
            return ClinicalNoteErrors.AppointmentNotCompleted;
        }

        if (await _clinicalNotes.ExistsForAppointmentAsync(appointment.Id, cancellationToken))
        {
            return ClinicalNoteErrors.AlreadyExists;
        }

        var patient = await _users.GetByIdAsync(appointment.PatientUserId, cancellationToken);
        if (patient is null)
        {
            return UserErrors.NotFound;
        }

        var utcNow = _clock.UtcNow;

        var clinicalNote = ClinicalNote.Create(
            appointmentId: appointment.Id,
            doctorUserId: appointment.DoctorUserId,
            patientUserId: appointment.PatientUserId,
            diagnosis: request.Diagnosis,
            observations: request.Observations,
            treatmentSummary: request.TreatmentSummary,
            followUpDate: request.FollowUpDate,
            followUpInstructions: request.FollowUpInstructions,
            utcNow: utcNow);

        if (request.Medications is { Count: > 0 })
        {
            foreach (var medication in request.Medications)
            {
                clinicalNote.AddMedication(
                    medication.Name,
                    medication.Dosage,
                    medication.Frequency,
                    medication.DurationInDays,
                    medication.Instructions);
            }
        }

        await _clinicalNotes.AddAsync(clinicalNote, cancellationToken);

        var doctorName = $"Dr. {doctor.FirstName} {doctor.LastName}";
        var notification = Notification.Create(
            userId: appointment.PatientUserId,
            title: "New Clinical Note",
            message: $"{doctorName} has added notes and a treatment plan for your appointment on {appointment.StartUtc:dd MMM yyyy}.",
            type: NotificationType.ClinicalNoteAdded,
            appointmentId: appointment.Id);

        await _notificationRepository.AddAsync(notification, cancellationToken);

        await _uow.SaveChangesAsync(cancellationToken);

        await _notificationService.SendToUserAsync(appointment.PatientUserId, notification, cancellationToken);

        return ClinicalNoteMapper.ToResponse(clinicalNote, appointment.StartUtc, doctor, patient);
    }
}
