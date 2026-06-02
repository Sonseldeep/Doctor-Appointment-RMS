namespace DoctorAppointmentSystem.Application.Abstractions.Otp;

public interface IOtpStore
{
    Task StoreAsync (Guid userId, string otp, DateTimeOffset expiresAt, CancellationToken cancellationToken);
    
    Task<bool> ValidateAndConsumeAsync(Guid userId, string otp, DateTimeOffset utcNow, CancellationToken cancellationToken);
}