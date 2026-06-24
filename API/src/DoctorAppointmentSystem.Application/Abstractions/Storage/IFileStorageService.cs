//namespace DoctorAppointmentSystem.Application.Abstractions.Storage;

//public interface IFileStorageService
//{
//    Task<string> UploadImageAsync(Stream imageStream, string fileName, string folder, CancellationToken cancellationToken);

//    Task DeleteImageAsync(string imageUrl, CancellationToken cancellationToken);
//}


namespace DoctorAppointmentSystem.Application.Abstractions.Storage;

public interface IFileStorageService
{
    // --- Existing Methods (Kept intact so other features don't break) ---
    Task<string> UploadImageAsync(Stream imageStream, string fileName, string folder, CancellationToken cancellationToken);
    Task DeleteImageAsync(string imageUrl, CancellationToken cancellationToken);

    // --- New Method for Hybrid Ingestion (PDFs, DICOM, Images) ---
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
}