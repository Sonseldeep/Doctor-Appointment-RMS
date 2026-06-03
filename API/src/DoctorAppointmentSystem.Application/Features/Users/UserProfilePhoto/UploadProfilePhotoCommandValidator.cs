using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Users.UserProfilePhoto;


internal sealed class UploadProfilePhotoCommandValidator
    : AbstractValidator<UploadProfilePhotoCommand>
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; 

    private static readonly string[] AllowedContentTypes =
    [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    private static readonly string[] AllowedExtensions =
    [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    public UploadProfilePhotoCommandValidator()
    {
        RuleFor(x => x.File)
            .NotNull()
            .WithMessage("Image file is required.");

        RuleFor(x => x.File.SizeInBytes)
            .GreaterThan(0)
            .WithMessage("Image file cannot be empty.")
            .LessThanOrEqualTo(MaxFileSizeBytes)
            .WithMessage("Image size must not exceed 10MB.");

        RuleFor(x => x.File.ContentType)
            .Must(ct => AllowedContentTypes.Contains(ct.ToLowerInvariant()))
            .WithMessage("Only JPEG, PNG, and WebP images are allowed.");

        RuleFor(x => x.File.FileName)
            .Must(fn =>
            {
                var ext = Path.GetExtension(fn).ToLowerInvariant();
                return AllowedExtensions.Contains(ext);
            })
            .WithMessage("File extension must be .jpg, .jpeg, .png, or .webp.");
        
        RuleFor(x => x.File)
            .Must(f =>
            {
                var ext = Path.GetExtension(f.FileName).ToLowerInvariant();
                return ext switch
                {
                    ".jpg" or ".jpeg" => f.ContentType is "image/jpeg" or "image/jpg",
                    ".png"            => f.ContentType == "image/png",
                    ".webp"           => f.ContentType == "image/webp",
                    _                 => false
                };
            })
            .WithMessage("File extension and content type do not match.");
    }
}
