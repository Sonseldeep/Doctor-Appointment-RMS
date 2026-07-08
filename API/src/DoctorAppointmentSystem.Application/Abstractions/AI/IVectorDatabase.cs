namespace DoctorAppointmentSystem.Application.Abstractions.AI;

public interface IVectorDatabase
{
    Task UpsertAsync(IEnumerable<VectorDocument> documents, CancellationToken cancellationToken = default);

    Task<List<VectorDocument>> SearchAsync(
        float[] queryEmbedding,
        VectorSearchFilter filter,
        int topK = 5,
        CancellationToken cancellationToken = default);

    Task DeleteBySourceIdAsync(Guid sourceDocumentId, CancellationToken cancellationToken = default);
}

public record VectorSearchFilter
{
    public required Guid PatientId { get; init; }
    public Guid? DoctorId { get; init; } // Optional: strict for doctors, null if patient is querying their own data
    public List<string>? DocumentTypes { get; init; }
}