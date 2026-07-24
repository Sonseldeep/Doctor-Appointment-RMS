namespace DoctorAppointmentSystem.Application.Abstractions.AI;

public record VectorDocument
{
    public required string Text { get; init; }
    public required string Id { get; init; }
    public DateTimeOffset RecordDate { get; set; }
}

public record VectorSearchFilter
{
    public Guid? PatientId { get; init; }
}