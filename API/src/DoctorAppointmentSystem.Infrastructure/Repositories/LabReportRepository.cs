using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Domain.Labs;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class LabReportRepository : ILabReportRepository
{
    private readonly ApplicationDbContext _context;

    public LabReportRepository(ApplicationDbContext context) => _context = context;

    public async Task AddAsync(LabReport report, CancellationToken cancellationToken = default)
    {
        await _context.LabReports.AddAsync(report, cancellationToken);
    }

    public async Task<IEnumerable<LabReport>> GetByPatientIdAsync(Guid patientId, CancellationToken cancellationToken = default)
    {
        return await _context.LabReports
            .Include(r => r.Observations)
            .Include(r => r.Documents)
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.ObservationDateTime)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<LabReport?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.LabReports
            .Include(r => r.Observations) 
            .Include(r => r.Documents)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }
}