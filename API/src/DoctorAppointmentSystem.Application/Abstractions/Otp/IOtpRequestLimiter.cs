using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Abstractions.Otp;

public interface IOtpRequestLimiter
{
    Task<ErrorOr<Success>> CheckAndIncrementAsync(string email, OtpPurpose purpose, DateTimeOffset utcNow, CancellationToken cancellationToken);
}