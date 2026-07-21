using DoctorAppointmentSystem.Application.Abstractions.AI;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class SqlVectorDatabase : IVectorDatabase
{
    private readonly ApplicationDbContext _context;

    public SqlVectorDatabase(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<VectorDocument>> SearchAsync(
        float[] embedding,
        VectorSearchFilter filter,
        int topK,
        CancellationToken ct)
    {
        return await _context.AiVectorRecords
            .Where(v => v.PatientId == filter.PatientId)
            .Select(v => new VectorDocument
            {
                Id = v.Id,
                Text = v.TextContent
            })
            .Take(topK)
            .ToListAsync(ct);
    }

    public async Task InsertRecordAsync(Guid patientId, string textContent, float[] embedding, CancellationToken ct)
    {
        var vectorRecord = new AiVectorRecord
        {
            Id = Guid.NewGuid().ToString(),
            PatientId = patientId,
            TextContent = textContent,
            Embedding = embedding
        };

        await _context.AiVectorRecords.AddAsync(vectorRecord, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<IEnumerable<string>> GetAllPatientTextRecordsAsync(Guid patientId, CancellationToken ct)
    {
        return await _context.AiVectorRecords
            .Where(v => v.PatientId == patientId)
            .Select(v => v.TextContent)
            .ToListAsync(ct);
    }
}