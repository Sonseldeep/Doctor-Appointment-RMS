using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Domain.Appointments;

namespace DoctorAppointmentSystem.Application.Features.Labs.Common;

public static class LabReportDoctorResolver
{
    public static async Task<Appointment?> ResolveAssociatedAppointmentAsync(
        IAppointmentRepository appointmentRepository,
        Guid patientUserId,
        DateTime observationDateTime,
        CancellationToken cancellationToken)
    {
        var appointments = await appointmentRepository.GetForPatientAsync(patientUserId, cancellationToken);

        var clinicalVisits = appointments
            .Where(a => a.Status is AppointmentStatus.Completed or AppointmentStatus.Confirmed)
            .OrderByDescending(a => a.StartUtc)
            .ToList();

        if (clinicalVisits.Count == 0)
        {
            return null;
        }

        var observationUtc = new DateTimeOffset(
            DateTime.SpecifyKind(observationDateTime, DateTimeKind.Utc));

        return clinicalVisits.FirstOrDefault(a => a.StartUtc <= observationUtc)
               ?? clinicalVisits[0];
    }
}