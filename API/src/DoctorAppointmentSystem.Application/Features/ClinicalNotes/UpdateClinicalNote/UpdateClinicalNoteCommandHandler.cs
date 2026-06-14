using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Common;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Domain.ClinicalNotes;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.UpdateClinicalNote;

internal sealed class UpdateClinicalNoteCommandHandler
    : ICommandHandler<UpdateClinicalNoteCommand, ClinicalNoteResponse>
{
    private readonly IClinicalNoteRepository _clinicalNotes;
    private readonly IAppointmentRepository _appointments;
    private readonly IUserRepository _users;
    private readonly IDateTimeProvider _clock;

    public UpdateClinicalNoteCommandHandler(
        IClinicalNoteRepository clinicalNotes,
        IAppointmentRepository appointments,
        IUserRepository users,
        IDateTimeProvider clock)
    {
        _clinicalNotes = clinicalNotes;
        _appointments = appointments;
        _users = users;
        _clock = clock;
    }

    public async Task<ErrorOr<ClinicalNoteResponse>> Handle(UpdateClinicalNoteCommand request, CancellationToken cancellationToken)
    {
        var note = await _clinicalNotes.GetByIdAsync(request.ClinicalNoteId, cancellationToken);
        if (note is null)
        {
            return ClinicalNoteErrors.NotFound;
        }

        if (note.DoctorUserId != request.DoctorUserId)
        {
            return ClinicalNoteErrors.Forbidden;
        }

        note.UpdateDetails(
            diagnosis: request.Diagnosis,
            observations: request.Observations,
            treatmentSummary: request.TreatmentSummary,
            followUpDate: request.FollowUpDate,
            followUpInstructions: request.FollowUpInstructions,
            utcNow: _clock.UtcNow);

        var medications = request.Medications ?? [];

        await _clinicalNotes.UpdateWithMedicationsAsync(note, medications, cancellationToken);

        var doctor = await _users.GetByIdAsync(note.DoctorUserId, cancellationToken);
        var patient = await _users.GetByIdAsync(note.PatientUserId, cancellationToken);

        if (doctor is null || patient is null)
        {
            return UserErrors.NotFound;
        }

        var appointment = await _appointments.GetByIdAsync(note.AppointmentId, cancellationToken);
        var appointmentDate = appointment?.StartUtc ?? note.CreatedAtUtc;

        note.ClearMedications();
        foreach (var m in medications)
        {
            note.AddMedication(m.Name, m.Dosage, m.Frequency, m.DurationInDays, m.Instructions);
        }
        
        return ClinicalNoteMapper.ToResponse(note, appointmentDate, doctor, patient);
    }
}