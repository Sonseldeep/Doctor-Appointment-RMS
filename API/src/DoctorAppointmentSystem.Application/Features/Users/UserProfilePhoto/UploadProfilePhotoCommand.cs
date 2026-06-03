using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Storage;

namespace DoctorAppointmentSystem.Application.Features.Users.UserProfilePhoto;

public sealed record UploadProfilePhotoCommand(
    Guid UserId,
    FileUploadModel File) : ICommand<UploadProfilePhotoResponse>;