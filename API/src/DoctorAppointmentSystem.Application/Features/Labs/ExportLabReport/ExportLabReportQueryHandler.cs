using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Application.Features.Labs.Common;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Labs.ExportLabReport;

public class ExportLabReportQueryHandler : IQueryHandler<ExportLabReportQuery, byte[]>
{
    private readonly ILabReportRepository _labRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IAppointmentRepository _appointmentRepository;

    public ExportLabReportQueryHandler(
        ILabReportRepository labRepository,
        IUserRepository userRepository,
        IPatientProfileRepository patientProfileRepository,
        IAppointmentRepository appointmentRepository)
    {
        _labRepository = labRepository;
        _userRepository = userRepository;
        _patientProfileRepository = patientProfileRepository;
        _appointmentRepository = appointmentRepository;
    }

    public async Task<ErrorOr<byte[]>> Handle(ExportLabReportQuery request, CancellationToken cancellationToken)
    {
        var report = await _labRepository.GetByIdAsync(request.LabReportId, cancellationToken);
        if (report is null)
        {
            return Error.NotFound(description: "The requested medical report could not be found.");
        }

        var user = await _userRepository.GetByIdAsync(report.PatientId, cancellationToken);
        if (user is null)
        {
            return Error.NotFound(description: "Patient associated with this report could not be found.");
        }

        var profile = await _patientProfileRepository.GetByUserIdAsync(report.PatientId, cancellationToken);

        var associatedAppointment = await LabReportDoctorResolver.ResolveAssociatedAppointmentAsync(
            _appointmentRepository, report.PatientId, report.ObservationDateTime, cancellationToken);

        var associatedDoctor = associatedAppointment is not null
            ? await _userRepository.GetByIdAsync(associatedAppointment.DoctorUserId, cancellationToken)
            : null;

        return LabReportPdfBuilder.Build(report, user, profile, associatedDoctor);
    }
}
