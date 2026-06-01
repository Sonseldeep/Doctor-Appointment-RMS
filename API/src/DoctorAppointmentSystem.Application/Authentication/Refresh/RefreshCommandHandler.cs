using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Authentication.Contracts;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Authentication.Refresh;

internal sealed class RefreshCommandHandler : ICommandHandler<RefreshCommand, LoginResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenStore _refreshTokenStore;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IRefreshTokenLifetime _refreshTokenLifetime;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshCommandHandler(
        IUserRepository userRepository,
        IRefreshTokenStore refreshTokenStore,
        IJwtTokenGenerator jwtTokenGenerator,
        IDateTimeProvider dateTimeProvider,
        IRefreshTokenLifetime refreshTokenLifetime,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _refreshTokenStore = refreshTokenStore;
        _jwtTokenGenerator = jwtTokenGenerator;
        _dateTimeProvider = dateTimeProvider;
        _refreshTokenLifetime = refreshTokenLifetime;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<LoginResponse>> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        var utcNow = _dateTimeProvider.UtcNow;

        var userId = await _refreshTokenStore.GetUserIdIfValidAsync(
            refreshToken: request.RefreshToken,
            utcNow: utcNow,
            cancellationToken: cancellationToken);

        if (userId is null)
        {
            return AuthErrors.RefreshTokenInvalid;
        }

        var user = await _userRepository.GetByIdAsync(userId.Value, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }
        
        user.RotateTokenVersion();


        var claims = AuthClaims.Create(user);

        var newAccessToken = _jwtTokenGenerator.GenerateAccessToken(claims);
        var newRefreshToken = RefreshTokenGenerator.Generate();
        var newExpiresAt = utcNow.Add(_refreshTokenLifetime.Duration);

        await _refreshTokenStore.StoreActiveAsync(user.Id, newRefreshToken, newExpiresAt, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = new LoginResponse(user.Id, newAccessToken, newRefreshToken);
        return result;
    }
}