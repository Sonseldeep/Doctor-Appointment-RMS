namespace DoctorAppointmentSystem.Api.Common.Request;

public sealed class UploadPhotoRequest
{
    public IFormFile File { get; set; } = null!;
}