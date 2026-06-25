//using CloudinaryDotNet;
//using CloudinaryDotNet.Actions;
//using DoctorAppointmentSystem.Application.Abstractions.Storage;
//using Microsoft.Extensions.Logging;
//using Microsoft.Extensions.Options;

//namespace DoctorAppointmentSystem.Infrastructure.Storage;

//internal sealed partial class CloudinaryFileStorageService : IFileStorageService
//{
//    private readonly Cloudinary _cloudinary;
//    private readonly ILogger<CloudinaryFileStorageService> _logger;

//    public CloudinaryFileStorageService(
//        IOptions<CloudinaryOptions> options,
//        ILogger<CloudinaryFileStorageService> logger)
//    {
//        _logger = logger;

//        var opt = options.Value;
//        var account = new Account(opt.CloudName, opt.ApiKey, opt.ApiSecret);

//        _cloudinary = new Cloudinary(account) { Api = { Secure = true } };
//    }

//    public async Task<string> UploadImageAsync(
//        Stream imageStream,
//        string fileName,
//        string folder,
//        CancellationToken cancellationToken)
//    {
//        var uploadParams = new ImageUploadParams
//        {
//            File = new FileDescription(fileName, imageStream),
//            Folder = folder,
//            Overwrite = true,
//            Transformation = new Transformation()
//                .Width(500)
//                .Height(500)
//                .Crop("limit")
//                .Quality("auto")
//                .FetchFormat("auto")
//        };

//        var result = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

//        if (result.Error is not null)
//        {
//            _logger.LogError(
//                "Cloudinary upload failed for {FileName}: {Error}",
//                fileName,
//                result.Error.Message);

//            throw new InvalidOperationException(
//                $"Image upload failed: {result.Error.Message}");
//        }

//        _logger.LogInformation(
//            "Image uploaded to Cloudinary. PublicId: {PublicId}",
//            result.PublicId);

//        return result.SecureUrl.ToString();
//    }

//    public async Task DeleteImageAsync(
//        string imageUrl,
//        CancellationToken cancellationToken)
//    {
//        var publicId = ExtractPublicId(imageUrl);

//        if (string.IsNullOrWhiteSpace(publicId))
//        {
//            _logger.LogWarning(
//                "Could not extract public ID from URL: {Url}", imageUrl);
//            return;
//        }

//        var result = await _cloudinary.DestroyAsync(new DeletionParams(publicId));

//        if (result.Error is not null)
//        {
//            _logger.LogError(
//                "Cloudinary delete failed for {PublicId}: {Error}",
//                publicId,
//                result.Error.Message);
//        }
//        else
//        {
//            _logger.LogInformation(
//                "Deleted image from Cloudinary. PublicId: {PublicId}", publicId);
//        }
//    }

//    private static string ExtractPublicId(string imageUrl)
//    {
//        try
//        {
//            var uri = new Uri(imageUrl);
//            var path = uri.AbsolutePath;

//            const string uploadSegment = "/upload/";
//            var uploadIndex = path.IndexOf(uploadSegment, StringComparison.Ordinal);
//            if (uploadIndex < 0)
//            {
//                return string.Empty;
//            }

//            var afterUpload = path[(uploadIndex + uploadSegment.Length)..];

//            var withoutVersion = MyRegex().Replace(afterUpload, string.Empty);

//            var dotIndex = withoutVersion.LastIndexOf('.');
//            return dotIndex >= 0
//                ? withoutVersion[..dotIndex]
//                : withoutVersion;
//        }
//        catch
//        {
//            return string.Empty;
//        }
//    }

//    [System.Text.RegularExpressions.GeneratedRegex(@"^v\d+/")]
//    private static partial System.Text.RegularExpressions.Regex MyRegex();
//}


using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DoctorAppointmentSystem.Application.Abstractions.Storage;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DoctorAppointmentSystem.Infrastructure.Storage;

internal sealed partial class CloudinaryFileStorageService : IFileStorageService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryFileStorageService> _logger;

    public CloudinaryFileStorageService(
        IOptions<CloudinaryOptions> options,
        ILogger<CloudinaryFileStorageService> logger)
    {
        _logger = logger;

        var opt = options.Value;
        var account = new Account(opt.CloudName, opt.ApiKey, opt.ApiSecret);

        _cloudinary = new Cloudinary(account) { Api = { Secure = true } };
    }

    public async Task<string> UploadImageAsync(
        Stream imageStream,
        string fileName,
        string folder,
        CancellationToken cancellationToken)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, imageStream),
            Folder = folder,
            Overwrite = true,
            Transformation = new Transformation()
                .Width(500)
                .Height(500)
                .Crop("limit")
                .Quality("auto")
                .FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

        if (result.Error is not null)
        {
            _logger.LogError(
                "Cloudinary upload failed for {FileName}: {Error}",
                fileName,
                result.Error.Message);

            throw new InvalidOperationException(
                $"Image upload failed: {result.Error.Message}");
        }

        _logger.LogInformation(
            "Image uploaded to Cloudinary. PublicId: {PublicId}",
            result.PublicId);

        return result.SecureUrl.ToString();
    }

    // --- NEW METHOD FOR HYBRID INGESTION ---
    public async Task<string> UploadAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "lab_reports", // Segregates lab attachments into their own directory
            Overwrite = true
            // Removed ResourceType = "auto" since "image" natively supports both PDFs and JPEGs
        };

        var result = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

        if (result.Error is not null)
        {
            _logger.LogError(
                "Cloudinary generic file upload failed for {FileName}: {Error}",
                fileName,
                result.Error.Message);

            throw new InvalidOperationException(
                $"File upload failed: {result.Error.Message}");
        }

        _logger.LogInformation(
            "Generic file successfully uploaded to Cloudinary. PublicId: {PublicId}",
            result.PublicId);

        return result.SecureUrl.ToString();
    }
    public async Task DeleteImageAsync(
        string imageUrl,
        CancellationToken cancellationToken)
    {
        var publicId = ExtractPublicId(imageUrl);

        if (string.IsNullOrWhiteSpace(publicId))
        {
            _logger.LogWarning(
                "Could not extract public ID from URL: {Url}", imageUrl);
            return;
        }

        var result = await _cloudinary.DestroyAsync(new DeletionParams(publicId));

        if (result.Error is not null)
        {
            _logger.LogError(
                "Cloudinary delete failed for {PublicId}: {Error}",
                publicId,
                result.Error.Message);
        }
        else
        {
            _logger.LogInformation(
                "Deleted image from Cloudinary. PublicId: {PublicId}", publicId);
        }
    }

    private static string ExtractPublicId(string imageUrl)
    {
        try
        {
            var uri = new Uri(imageUrl);
            var path = uri.AbsolutePath;

            const string uploadSegment = "/upload/";
            var uploadIndex = path.IndexOf(uploadSegment, StringComparison.Ordinal);
            if (uploadIndex < 0)
            {
                return string.Empty;
            }

            var afterUpload = path[(uploadIndex + uploadSegment.Length)..];

            var withoutVersion = MyRegex().Replace(afterUpload, string.Empty);

            var dotIndex = withoutVersion.LastIndexOf('.');
            return dotIndex >= 0
                ? withoutVersion[..dotIndex]
                : withoutVersion;
        }
        catch
        {
            return string.Empty;
        }
    }

    [System.Text.RegularExpressions.GeneratedRegex(@"^v\d+/")]
    private static partial System.Text.RegularExpressions.Regex MyRegex();
}