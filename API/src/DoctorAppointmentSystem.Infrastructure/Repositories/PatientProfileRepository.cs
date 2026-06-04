using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class PatientProfileRepository : IPatientProfileRepository
{
    private readonly ApplicationDbContext _db;

    public PatientProfileRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PatientProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        => await _db.PatientProfiles.SingleOrDefaultAsync(x => x.UserId == userId, cancellationToken);

    public async Task AddAsync(PatientProfile profile, CancellationToken cancellationToken)
        => await _db.PatientProfiles.AddAsync(profile, cancellationToken);
}