namespace DoctorAppointmentSystem.Application.Abstractions.AI;

public record VectorDocument
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public required string Text { get; init; }
    public required float[] Embedding { get; init; }
    public required VectorMetadata Metadata { get; init; }
}

public record VectorMetadata
{
    public required Guid PatientId { get; init; }
    public required Guid DoctorId { get; init; }
    public required string DocumentType { get; init; } // e.g., "ClinicalNote", "LabReport"
    public required Guid SourceDocumentId { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}