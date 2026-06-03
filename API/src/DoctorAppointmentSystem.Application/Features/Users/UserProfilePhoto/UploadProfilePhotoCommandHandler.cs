using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Storage;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Users.UserProfilePhoto;

internal sealed class UploadProfilePhotoCommandHandler
    : ICommandHandler<UploadProfilePhotoCommand, UploadProfilePhotoResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IUnitOfWork _unitOfWork;

    private const string ProfilePhotosFolder = "doctor-appointment/profiles";

    public UploadProfilePhotoCommandHandler(
        IUserRepository userRepository,
        IFileStorageService fileStorageService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _fileStorageService = fileStorageService;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<UploadProfilePhotoResponse>> Handle(
        UploadProfilePhotoCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }
            

        if (!string.IsNullOrWhiteSpace(user.ProfilePhotoUrl))
        {
            await _fileStorageService.DeleteImageAsync(user.ProfilePhotoUrl, cancellationToken);
        }

        var photoUrl = await _fileStorageService.UploadImageAsync(
            request.File.Content,
            request.File.FileName,
            $"{ProfilePhotosFolder}/{request.UserId}",
            cancellationToken);

        user.UpdateProfilePhoto(photoUrl);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UploadProfilePhotoResponse(photoUrl);
    }
}

