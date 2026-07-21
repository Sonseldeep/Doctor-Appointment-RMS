public class AiVectorRecord
{
    public string Id { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public string TextContent { get; set; } = string.Empty;
    public float[] Embedding { get; set; } = [];
}