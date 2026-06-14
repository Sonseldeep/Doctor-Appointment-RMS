using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Domain.ClinicalNotes;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class ClinicalNoteRepository : IClinicalNoteRepository
{
    private readonly ApplicationDbContext _db;

    public ClinicalNoteRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ClinicalNote?> GetByIdAsync(Guid clinicalNoteId, CancellationToken cancellationToken)
        => await _db.ClinicalNotes
            .Include(x => x.Medications)
            .SingleOrDefaultAsync(x => x.Id == clinicalNoteId, cancellationToken);

    public async Task<ClinicalNote?> GetByAppointmentIdAsync(Guid appointmentId, CancellationToken cancellationToken)
        => await _db.ClinicalNotes
            .Include(x => x.Medications)
            .SingleOrDefaultAsync(x => x.AppointmentId == appointmentId, cancellationToken);

    public async Task<bool> ExistsForAppointmentAsync(Guid appointmentId, CancellationToken cancellationToken)
        => await _db.ClinicalNotes.AnyAsync(x => x.AppointmentId == appointmentId, cancellationToken);

    public async Task AddAsync(ClinicalNote clinicalNote, CancellationToken cancellationToken)
        => await _db.ClinicalNotes.AddAsync(clinicalNote, cancellationToken);

    public async Task UpdateWithMedicationsAsync(
        ClinicalNote note,
        List<MedicationRequest> medications,
        CancellationToken cancellationToken)
    {
        await _db.Database.ExecuteSqlRawAsync(
            """
            UPDATE [hospital_management].[clinical_notes]
            SET [Diagnosis] = {0},
                [Observations] = {1},
                [TreatmentSummary] = {2},
                [FollowUpDate] = {3},
                [FollowUpInstructions] = {4},
                [UpdatedAtUtc] = {5}
            WHERE [Id] = {6}
            """,
            parameters: new object[]
            {
                note.Diagnosis,
                (object?)note.Observations ?? DBNull.Value,
                (object?)note.TreatmentSummary ?? DBNull.Value,
                (object?)note.FollowUpDate ?? DBNull.Value,
                (object?)note.FollowUpInstructions ?? DBNull.Value,
                note.UpdatedAtUtc,
                note.Id
            },
            cancellationToken: cancellationToken);

        await _db.Database.ExecuteSqlRawAsync(
            "DELETE FROM [hospital_management].[clinical_note_medications] WHERE [ClinicalNoteId] = {0}",
            parameters: new object[] { note.Id },
            cancellationToken: cancellationToken);

        foreach (var m in medications)
        {
            await _db.Database.ExecuteSqlRawAsync(
                """
                INSERT INTO [hospital_management].[clinical_note_medications]
                    ([Id], [ClinicalNoteId], [Name], [Dosage], [Frequency], [DurationInDays], [Instructions])
                VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6})
                """,
                parameters: new object[]
                {
                    Guid.NewGuid(),
                    note.Id,
                    m.Name,
                    m.Dosage,
                    m.Frequency,
                    (object?)m.DurationInDays ?? DBNull.Value,
                    (object?)m.Instructions ?? DBNull.Value
                },
                cancellationToken: cancellationToken);
        }
    }

    public async Task<IReadOnlyList<ClinicalNoteWithDetailsDto>> GetForPatientAsync(
        Guid patientUserId,
        CancellationToken cancellationToken)
        => await GetWithDetailsAsync(_db.ClinicalNotes.Where(x => x.PatientUserId == patientUserId), cancellationToken);

    public async Task<IReadOnlyList<ClinicalNoteWithDetailsDto>> GetForDoctorAsync(
        Guid doctorUserId,
        CancellationToken cancellationToken)
        => await GetWithDetailsAsync(_db.ClinicalNotes.Where(x => x.DoctorUserId == doctorUserId), cancellationToken);

    private async Task<IReadOnlyList<ClinicalNoteWithDetailsDto>> GetWithDetailsAsync(
        IQueryable<ClinicalNote> source,
        CancellationToken cancellationToken)
    {
        var notes = await source
            .AsNoTracking()
            .Include(x => x.Medications)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        if (notes.Count == 0)
            return [];

        var appointmentIds = notes.Select(x => x.AppointmentId).ToList();
        var userIds = notes.SelectMany(x => new[] { x.DoctorUserId, x.PatientUserId }).Distinct().ToList();

        var appointmentStarts = await _db.Appointments
            .AsNoTracking()
            .Where(a => appointmentIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => a.StartUtc, cancellationToken);

        var users = await _db.Users
            .AsNoTracking()
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, cancellationToken);

        return notes.Select(note =>
        {
            var doctor = users[note.DoctorUserId];
            var patient = users[note.PatientUserId];
            var appointmentStart = appointmentStarts.TryGetValue(note.AppointmentId, out var start)
                ? start
                : note.CreatedAtUtc;

            return new ClinicalNoteWithDetailsDto(
                note.Id,
                note.AppointmentId,
                note.DoctorUserId,
                note.PatientUserId,
                note.Diagnosis,
                note.Observations,
                note.TreatmentSummary,
                note.FollowUpDate,
                note.FollowUpInstructions,
                note.CreatedAtUtc,
                note.UpdatedAtUtc,
                appointmentStart,
                doctor.FirstName,
                doctor.LastName,
                doctor.ProfilePhotoUrl,
                patient.FirstName,
                patient.LastName,
                patient.ProfilePhotoUrl,
                note.Medications);
        }).ToList();
    }
}