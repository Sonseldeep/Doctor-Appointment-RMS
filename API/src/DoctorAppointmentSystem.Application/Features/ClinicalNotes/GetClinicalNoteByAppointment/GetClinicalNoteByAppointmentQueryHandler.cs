using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Common;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.ClinicalNotes;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetClinicalNoteByAppointment;

internal sealed class GetClinicalNoteByAppointmentQueryHandler
    : IQueryHandler<GetClinicalNoteByAppointmentQuery, ClinicalNoteResponse>
{
    private readonly IClinicalNoteRepository _clinicalNotes;
    private readonly IAppointmentRepository _appointments;
    private readonly IUserRepository _users;

    public GetClinicalNoteByAppointmentQueryHandler(
        IClinicalNoteRepository clinicalNotes,
        IAppointmentRepository appointments,
        IUserRepository users)
    {
        _clinicalNotes = clinicalNotes;
        _appointments = appointments;
        _users = users;
    }

    public async Task<ErrorOr<ClinicalNoteResponse>> Handle(GetClinicalNoteByAppointmentQuery request, CancellationToken cancellationToken)
    {
        var appointment = await _appointments.GetByIdAsync(request.AppointmentId, cancellationToken);
        if (appointment is null)
        {
            return AppointmentErrors.NotFound;
        }

        if (appointment.DoctorUserId != request.UserId && appointment.PatientUserId != request.UserId)
        {
            return AppointmentErrors.Forbidden;
        }

        var note = await _clinicalNotes.GetByAppointmentIdAsync(request.AppointmentId, cancellationToken);
        if (note is null)
        {
            return ClinicalNoteErrors.NotFound;
        }

        var doctor = await _users.GetByIdAsync(note.DoctorUserId, cancellationToken);
        var patient = await _users.GetByIdAsync(note.PatientUserId, cancellationToken);

        if (doctor is null || patient is null)
        {
            return UserErrors.NotFound;
        }

        return ClinicalNoteMapper.ToResponse(note, appointment.StartUtc, doctor, patient);
    }
}
