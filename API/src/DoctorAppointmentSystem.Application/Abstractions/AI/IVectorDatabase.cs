using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DoctorAppointmentSystem.Application.Abstractions.AI;

public interface IVectorDatabase
{
    Task<IEnumerable<VectorDocument>> SearchAsync(
        float[] embedding,
        VectorSearchFilter filter,
        int topK,
        CancellationToken ct);

    Task InsertRecordAsync(Guid patientId, string textContent, float[] embedding, CancellationToken ct);

    Task<IEnumerable<string>> GetAllPatientTextRecordsAsync(Guid patientId, CancellationToken ct);
}