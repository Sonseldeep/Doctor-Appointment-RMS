using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Application.Abstractions.Otp;

public interface IOtpStore
{
    Task StoreAsync (Guid userId, OtpPurpose purpose, string otp, DateTimeOffset expiresAt, CancellationToken cancellationToken);
    
    Task<bool> ValidateAndConsumeAsync(Guid userId,OtpPurpose purpose, string otp, DateTimeOffset utcNow, CancellationToken cancellationToken);
    
    Task InvalidateActiveAsync(Guid userId, OtpPurpose purpose, DateTimeOffset utcNow, CancellationToken cancellationToken);
}