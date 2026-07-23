using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Application.Common;
namespace DoctorAppointmentSystem.Application.Abstractions.Appointments;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(Guid appointmentId, CancellationToken cancellationToken);
    Task AddAsync(Appointment appointment, CancellationToken cancellationToken);

    Task<IReadOnlyList<Appointment>> GetForPatientAsync(Guid patientUserId, CancellationToken cancellationToken);
    Task<IReadOnlyList<Appointment>> GetForDoctorAsync(Guid doctorUserId, CancellationToken cancellationToken);

    Task<bool> DoctorHasOverlapAsync(
        Guid doctorUserId,
        DateTimeOffset startUtc,
        DateTimeOffset endUtc,
        CancellationToken cancellationToken);
    
    Task<int> GetDoctorAppointmentCountForDateAsync(
        Guid doctorUserId,
        DateTime appointmentDate,
        CancellationToken cancellationToken);


    Task<PagedResult<AppointmentWithDetailsDto>> GetForPatientWithDetailsAsync(
        Guid patientUserId,
        int page,
        int pageSize,
        CancellationToken cancellationToken);

    Task<PagedResult<AppointmentWithDetailsDto>> GetForDoctorWithDetailsAsync(
        Guid doctorUserId,
        int page,
        int pageSize,
        CancellationToken cancellationToken);


    Task<bool> HasCompletedAppointmentAsync(
        Guid patientUserId,
        Guid doctorUserId,
        CancellationToken cancellationToken);

    Task<bool> PatientHasOverlapAsync(
        Guid patientUserId,
        DateTimeOffset startUtc,
        DateTimeOffset endUtc,
        CancellationToken cancellationToken);

    Task<bool> HasAssociationAsync(Guid doctorUserId, Guid patientUserId, CancellationToken cancellationToken);


    Task<bool> PatientHasBookingWithDoctorOnDateAsync(
        Guid patientUserId,
        Guid doctorUserId,
        DateOnly date,
        CancellationToken cancellationToken);
}