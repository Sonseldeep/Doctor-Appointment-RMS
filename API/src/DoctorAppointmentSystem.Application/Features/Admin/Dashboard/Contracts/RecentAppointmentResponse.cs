using DoctorAppointmentSystem.Domain.Appointments;

namespace DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;

public sealed record RecentAppointmentResponse(
    Guid AppointmentId,
    string PatientName,
    string DoctorName,
    AppointmentStatus Status,
    DateTimeOffset StartUtc);