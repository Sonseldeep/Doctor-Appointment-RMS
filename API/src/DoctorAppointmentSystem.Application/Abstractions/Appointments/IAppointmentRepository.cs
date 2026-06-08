using DoctorAppointmentSystem.Domain.Appointments;

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
    
    

}