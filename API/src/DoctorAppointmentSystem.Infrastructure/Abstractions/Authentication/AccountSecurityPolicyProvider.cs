using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using Microsoft.Extensions.Options;

namespace DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;

internal sealed class AccountSecurityPolicyProvider : IAccountLockoutOptions, IPasswordPolicyOptions
{
    private readonly SecurityOptions _options;

    public AccountSecurityPolicyProvider(IOptions<SecurityOptions> options)
    {
        _options = options.Value;
    }
    
    public int MaxFailedAttempts => _options.MaxFailedLoginAttempts;
    public TimeSpan LockoutDuration => TimeSpan.FromHours(_options.LockoutDurationHours);
    // public TimeSpan MaxPasswordAge => TimeSpan.FromDays(_options.PasswordExpiryDays);
}