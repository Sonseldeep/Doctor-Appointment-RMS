using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ChangePassword;

public sealed class ChangePasswordCommandHandler : ICommandHandler<ChangePasswordCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenStore _refreshTokenStore;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public ChangePasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IRefreshTokenStore refreshTokenStore,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _refreshTokenStore = refreshTokenStore;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<Success>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return Error.Unauthorized(description: "Unauthorized.");
        }

        var ok = _passwordHasher.Verify(request.CurrentPassword, user.PasswordHash);
        if (!ok)
        {
            return Error.Validation(code: "Password.Invalid", description: "Current password is incorrect.");
        }

        var newHash = _passwordHasher.Hash(request.NewPassword);
        user.ChangePasswordHash(newHash);

        user.RotateTokenVersion();
        await _refreshTokenStore.RevokeActiveAsync(user.Id, _dateTimeProvider.UtcNow, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }
}