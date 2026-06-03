namespace DoctorAppointmentSystem.Application.Abstractions.Storage;

public sealed record FileUploadModel(
    Stream Content,
    string FileName,
    string ContentType,
    long SizeInBytes);