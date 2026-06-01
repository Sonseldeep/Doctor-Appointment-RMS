using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Users.RefreshToken;

internal sealed class RefreshTokenCommandHandler(IJwtService jwtService)
    : ICommandHandler<RefreshTokenCommand, AccessTokenResponse>
{
    public async Task<ErrorOr<AccessTokenResponse>> Handle(
        RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        var result = await jwtService.RefreshTokenAsync(
            request.RefreshToken,
            cancellationToken);

        if (result.IsError)
            return UserErrors.InvalidCredentials;

        var token = result.Value;

        return new AccessTokenResponse(
            token.AccessToken,
            token.RefreshToken,
            token.ExpiresIn,
            token.RefreshExpiresIn);
    }
}