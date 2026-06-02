using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Otp;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ResetPassword;

public sealed class ResetPasswordCommandHandler : ICommandHandler<ResetPasswordCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IOtpStore _otpStore;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenStore _refreshTokenStore;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public ResetPasswordCommandHandler(
        IUserRepository userRepository,
        IOtpStore otpStore,
        IPasswordHasher passwordHasher,
        IRefreshTokenStore refreshTokenStore,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _otpStore = otpStore;
        _passwordHasher = passwordHasher;
        _refreshTokenStore = refreshTokenStore;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<Success>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null || !user.IsEmailVerified)
        {
            return OtpErrors.InValid;
        }

        var utcNow = _dateTimeProvider.UtcNow;

        var ok = await _otpStore.ValidateAndConsumeAsync(
            user.Id,
            OtpPurpose.PasswordReset,
            request.Otp,
            utcNow,
            cancellationToken);

        if (!ok)
        {
            return OtpErrors.InValid;
        }

        var newHash = _passwordHasher.Hash(request.NewPassword);
        user.ChangePasswordHash(newHash);

        user.RotateTokenVersion();
        await _refreshTokenStore.RevokeActiveAsync(user.Id, utcNow, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }
}