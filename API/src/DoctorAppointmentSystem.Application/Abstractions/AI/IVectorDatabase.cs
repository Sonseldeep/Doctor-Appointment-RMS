using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DoctorAppointmentSystem.Application.Abstractions.AI;

public interface IVectorDatabase
{
    Task<IEnumerable<VectorDocument>> HybridSearchAsync(
        string query,
        float[] queryEmbedding,
        Guid patientId,
        int topK,
        CancellationToken ct);

    // NEW: Added RecordDate parameter
    Task InsertRecordAsync(
        Guid patientId,
        string textContent,
        float[] embedding,
        DateTimeOffset recordDate,
        CancellationToken ct);

    Task<IEnumerable<string>> GetAllPatientTextRecordsAsync(Guid patientId, CancellationToken ct);
}