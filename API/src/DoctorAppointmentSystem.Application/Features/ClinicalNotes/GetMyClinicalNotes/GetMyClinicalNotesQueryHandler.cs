using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Common;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.GetMyClinicalNotes;

internal sealed class GetMyClinicalNotesQueryHandler
    : IQueryHandler<GetMyClinicalNotesQuery, IReadOnlyList<ClinicalNoteResponse>>
{
    private readonly IUserRepository _users;
    private readonly IClinicalNoteRepository _clinicalNotes;

    public GetMyClinicalNotesQueryHandler(IUserRepository users, IClinicalNoteRepository clinicalNotes)
    {
        _users = users;
        _clinicalNotes = clinicalNotes;
    }

    public async Task<ErrorOr<IReadOnlyList<ClinicalNoteResponse>>> Handle(GetMyClinicalNotesQuery request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }

        var notes = user.Role switch
        {
            UserRole.Doctor => await _clinicalNotes.GetForDoctorAsync(request.UserId, cancellationToken),
            _ => await _clinicalNotes.GetForPatientAsync(request.UserId, cancellationToken),
        };

        return notes.Select(ClinicalNoteMapper.ToResponse).ToList().AsReadOnly();
    }
}