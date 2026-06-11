using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;

internal sealed class GetMyAppointmentsQueryHandler
    : IQueryHandler<GetMyAppointmentsQuery, IReadOnlyList<AppointmentResponse>>
{
    private readonly IUserRepository _users;
    private readonly IAppointmentRepository _appointments;

    public GetMyAppointmentsQueryHandler(IUserRepository users, IAppointmentRepository appointments)
    {
        _users = users;
        _appointments = appointments;
    }

    public async Task<ErrorOr<IReadOnlyList<AppointmentResponse>>> Handle(GetMyAppointmentsQuery request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }

        var list = user.Role switch
        {
            UserRole.Doctor => await _appointments.GetForDoctorWithDetailsAsync(request.UserId, cancellationToken),
            _ => await _appointments.GetForPatientWithDetailsAsync(request.UserId, cancellationToken),
        };

        var result = list.Select(a => new AppointmentResponse(
            Id: a.Id,
            PatientUserId: a.PatientUserId,
            DoctorUserId: a.DoctorUserId,
            StartUtc: a.StartUtc,
            EndUtc: a.EndUtc,
            Status: a.Status,
            Notes: a.Notes,
            DoctorName: $"{a.DoctorFirstName} {a.DoctorLastName}",
            DoctorNmcNumber: a.DoctorNmcNumber,
            DoctorPhotoUrl: a.DoctorPhotoUrl,
            DoctorSpecialization: a.DoctorSpecialization,
            PatientName: $"{a.PatientFirstName} {a.PatientLastName}",
            PatientSex: a.PatientSex,
            PatientAge: a.PatientAge,
            PatientPhotoUrl: a.PatientPhotoUrl)).ToList().AsReadOnly();

        return result;
    }
}
