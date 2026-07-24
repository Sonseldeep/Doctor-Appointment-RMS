using DoctorAppointmentSystem.Application.Abstractions.AI;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class SqlVectorDatabase : IVectorDatabase
{
    private readonly ApplicationDbContext _context;

    public SqlVectorDatabase(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<VectorDocument>> HybridSearchAsync(
        string query,
        float[] queryEmbedding,
        Guid patientId,
        int topK,
        CancellationToken ct)
    {
        //  Fetch candidate records scoped to the patient
        var candidateRecords = await _context.AiVectorRecords
            .Where(v => v.PatientId == patientId)
            .ToListAsync(ct);

        if (!candidateRecords.Any())
            return Enumerable.Empty<VectorDocument>();

        //  Vector Search Ranking (Cosine Similarity)
        var vectorRanked = candidateRecords
            .Select(r => new { Record = r, Score = CosineSimilarity(queryEmbedding, r.Embedding) })
            .OrderByDescending(x => x.Score)
            .Select((x, index) => new { x.Record, Rank = index + 1 })
            .ToList();

        //  Lexical Search Ranking (Naive Term Frequency)
        var queryTerms = query.ToLowerInvariant()
            .Split(new[] { ' ', '?', '.', ',', ';' }, StringSplitOptions.RemoveEmptyEntries);

        var lexicalRanked = candidateRecords
            .Select(r => new {
                Record = r,
                Score = queryTerms.Count(t => r.TextContent.ToLowerInvariant().Contains(t))
            })
            .OrderByDescending(x => x.Score)
            .Select((x, index) => new { x.Record, Rank = index + 1 })
            .ToList();

        // Reciprocal Rank Fusion (RRF)
        const int rrfK = 60; // Standard constant for RRF smoothing
        var rrfScores = new Dictionary<string, double>();

        foreach (var item in vectorRanked)
        {
            rrfScores[item.Record.Id] = 1.0 / (rrfK + item.Rank);
        }

        foreach (var item in lexicalRanked)
        {
            rrfScores[item.Record.Id] += 1.0 / (rrfK + item.Rank);
        }

        //  Select Top K based on fused score
        var topRecordIds = rrfScores
            .OrderByDescending(kvp => kvp.Value)
            .Take(topK)
            .Select(kvp => kvp.Key)
            .ToHashSet();

        //CHRONOLOGICAL RE-RANKING
        return candidateRecords
            .Where(r => topRecordIds.Contains(r.Id))
            .OrderBy(r => r.RecordDate)
            .Select(r => new VectorDocument
            {
                Id = r.Id,
                Text = r.TextContent,
                RecordDate = r.RecordDate
            });
    }

    public async Task InsertRecordAsync(
        Guid patientId,
        string textContent,
        float[] embedding,
        DateTimeOffset recordDate,
        CancellationToken ct)
    {
        var vectorRecord = new AiVectorRecord
        {
            Id = Guid.NewGuid().ToString(),
            PatientId = patientId,
            TextContent = textContent,
            Embedding = embedding,
            RecordDate = recordDate
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

    //Calculates directional similarity between two vectors
    private static float CosineSimilarity(float[] vector1, float[] vector2)
    {
        if (vector1 == null || vector2 == null || vector1.Length != vector2.Length)
            return 0;

        float dot = 0, mag1 = 0, mag2 = 0;
        for (int i = 0; i < vector1.Length; i++)
        {
            dot += vector1[i] * vector2[i];
            mag1 += vector1[i] * vector1[i];
            mag2 += vector2[i] * vector2[i];
        }

        if (mag1 == 0 || mag2 == 0) return 0;

        return (float)(dot / (Math.Sqrt(mag1) * Math.Sqrt(mag2)));
    }
}