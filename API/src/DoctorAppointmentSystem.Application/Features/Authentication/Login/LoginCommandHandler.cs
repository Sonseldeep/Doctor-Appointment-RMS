//using DoctorAppointmentSystem.Application.Abstractions.Authentication;
//using DoctorAppointmentSystem.Application.Abstractions.Data;
//using DoctorAppointmentSystem.Application.Abstractions.Messaging;
//using DoctorAppointmentSystem.Application.Features.Authentication.Common;
//using DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;
//using DoctorAppointmentSystem.Domain.Users;
//using ErrorOr;

//namespace DoctorAppointmentSystem.Application.Features.Authentication.Login;

//public class LoginCommandHandler : ICommandHandler<LoginCommand, LoginResponse>
//{
//    private readonly IUserRepository _userRepository;
//    private readonly IPasswordHasher _passwordHasher;
//    private readonly IJwtTokenGenerator _jwtTokenGenerator;
//    private readonly IRefreshTokenStore _refreshTokenStore;
//    private readonly IDateTimeProvider _dateTimeProvider;
//    private readonly IUnitOfWork _unitOfWork;
//    private readonly IRefreshTokenLifetime _refreshTokenLifetime;
//    private readonly IAccountLockoutOptions  _accountLockoutOptions;
//    private readonly IPasswordPolicyOptions _passwordPolicyOptions;

//    public LoginCommandHandler(
//        IUserRepository userRepository,
//        IPasswordHasher passwordHasher,
//        IJwtTokenGenerator jwtTokenGenerator,
//        IRefreshTokenStore refreshTokenStore,
//        IDateTimeProvider dateTimeProvider,
//        IUnitOfWork unitOfWork,
//        IRefreshTokenLifetime refreshTokenLifetime,
//        IPasswordPolicyOptions passwordPolicyOptions,
//        IAccountLockoutOptions accountLockoutOptions)
//    {
//        _userRepository = userRepository;
//        _passwordHasher = passwordHasher;
//        _jwtTokenGenerator = jwtTokenGenerator;
//        _refreshTokenStore = refreshTokenStore;
//        _dateTimeProvider = dateTimeProvider;
//        _unitOfWork = unitOfWork;
//        _refreshTokenLifetime = refreshTokenLifetime;
//        _passwordPolicyOptions = passwordPolicyOptions;
//        _accountLockoutOptions = accountLockoutOptions;
//    }

//    public async Task<ErrorOr<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
//    {
//        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

//        if (user is null)
//        {
//            return AuthErrors.InvalidCredentials;
//        }

//        var utcNow = _dateTimeProvider.UtcNow;

//        // checked BEFORE password verification
//        if (user.IsLockedOut(utcNow))
//        {
//            return AuthErrors.AccountLocked(user.LockedOutUntil!.Value);
//        }

//        var isValidPassword = _passwordHasher.Verify(request.Password, user.PasswordHash);

//        if (!isValidPassword)
//        {
//            var justLockedOut = user.RecordFailedLoginAttempt(_accountLockoutOptions.MaxFailedAttempts,_accountLockoutOptions.LockoutDuration,utcNow);

//            await _unitOfWork.SaveChangesAsync(cancellationToken);

//            return justLockedOut? AuthErrors.AccountLocked(user.LockedOutUntil!.Value) : AuthErrors.InvalidCredentials;
//        }

//        if (!user.IsEmailVerified)
//        {
//            return UserErrors.NotVerified;
//        }

//        user.RotateTokenVersion();

//        var claims = AuthClaims.Create(user);
//        var accessToken = _jwtTokenGenerator.GenerateAccessToken(claims);
//        var refreshToken = RefreshTokenGenerator.Generate();

//        var expiresAt = _dateTimeProvider.UtcNow.Add(_refreshTokenLifetime.Duration);

//        await _refreshTokenStore.StoreActiveAsync(user.Id, refreshToken, expiresAt, cancellationToken);
//        await _unitOfWork.SaveChangesAsync(cancellationToken);

//        // var mustChangePassword = user.IsPasswordExpired(utcNow, _passwordPolicyOptions.MaxPasswordAge);

//        var result = new LoginResponse(user.Id, accessToken, refreshToken);

//        return result;

//    }
//}

using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Authentication.Common;
using DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Authentication.Login;

public class LoginCommandHandler : ICommandHandler<LoginCommand, LoginResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokenStore _refreshTokenStore;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRefreshTokenLifetime _refreshTokenLifetime;
    private readonly IAccountLockoutOptions _accountLockoutOptions;
    private readonly IPasswordPolicyOptions _passwordPolicyOptions;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IRefreshTokenStore refreshTokenStore,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork,
        IRefreshTokenLifetime refreshTokenLifetime,
        IPasswordPolicyOptions passwordPolicyOptions,
        IAccountLockoutOptions accountLockoutOptions)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _refreshTokenStore = refreshTokenStore;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
        _refreshTokenLifetime = refreshTokenLifetime;
        _passwordPolicyOptions = passwordPolicyOptions;
        _accountLockoutOptions = accountLockoutOptions;
    }

    public async Task<ErrorOr<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null)
        {
            return AuthErrors.InvalidCredentials;
        }

        var utcNow = _dateTimeProvider.UtcNow;

        // checked BEFORE password verification
        if (user.IsLockedOut(utcNow))
        {
            return AuthErrors.AccountLocked(user.LockedOutUntil!.Value);
        }

        var isValidPassword = _passwordHasher.Verify(request.Password, user.PasswordHash);

        if (!isValidPassword)
        {
            var justLockedOut = user.RecordFailedLoginAttempt(_accountLockoutOptions.MaxFailedAttempts, _accountLockoutOptions.LockoutDuration, utcNow);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return justLockedOut ? AuthErrors.AccountLocked(user.LockedOutUntil!.Value) : AuthErrors.InvalidCredentials;
        }

        if (!user.IsEmailVerified)
        {
            return UserErrors.NotVerified;
        }

        user.RotateTokenVersion();

        var claims = AuthClaims.Create(user);
        var accessToken = _jwtTokenGenerator.GenerateAccessToken(claims);
        var refreshToken = RefreshTokenGenerator.Generate();

        var expiresAt = _dateTimeProvider.UtcNow.Add(_refreshTokenLifetime.Duration);

        await _refreshTokenStore.StoreActiveAsync(user.Id, refreshToken, expiresAt, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // var mustChangePassword = user.IsPasswordExpired(utcNow, _passwordPolicyOptions.MaxPasswordAge);

        var result = new LoginResponse(user.Id, accessToken, refreshToken);

        return result;

    }
}