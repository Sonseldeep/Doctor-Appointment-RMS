using System.Threading;
using System.Threading.Tasks;
using DoctorAppointmentSystem.Domain.Labs;

namespace DoctorAppointmentSystem.Application.Abstractions.Labs;

public interface IMedicalRecordAccessLogRepository
{
    Task AddAsync(MedicalRecordAccessLog log, CancellationToken cancellationToken = default);
}