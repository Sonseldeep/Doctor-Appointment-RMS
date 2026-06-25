namespace DoctorAppointmentSystem.Application.Abstractions.Storage;

public interface IFileStorageService
{
  
    Task<string> UploadImageAsync(Stream imageStream, string fileName, string folder, CancellationToken cancellationToken);
    Task DeleteImageAsync(string imageUrl, CancellationToken cancellationToken);

    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
}