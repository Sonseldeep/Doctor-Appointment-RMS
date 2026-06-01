// using DoctorAppointmentSystem.Application.Abstractions.Authentication;
// using DoctorAppointmentSystem.Application.Abstractions.Messaging;
// using DoctorAppointmentSystem.Domain.Users;
// using ErrorOr;
//
// namespace DoctorAppointmentSystem.Application.Users.Login;
//
// internal sealed class LogInUserCommandHandler(IJwtService jwtService)
//     : ICommandHandler<LogInUserCommand, AccessTokenResponse>
// {
//     public async Task<ErrorOr<AccessTokenResponse>> Handle(LogInUserCommand request, CancellationToken cancellationToken)
//     {
//         var tokenResult = await jwtService.GetAccessTokenAsync(
//             request.Email,
//             request.Password,
//             cancellationToken);
//
//         if (tokenResult.IsError)
//         {
//             return UserErrors.InvalidCredentials;
//         }
//
//         return new AccessTokenResponse(tokenResult.Value);
//     }
// }

using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Users.Login;

internal sealed class LogInUserCommandHandler(IJwtService jwtService)
    : ICommandHandler<LogInUserCommand, AccessTokenResponse>
{
    public async Task<ErrorOr<AccessTokenResponse>> Handle(
        LogInUserCommand request,
        CancellationToken cancellationToken)
    {
        var result = await jwtService.GetAccessTokenAsync(
            request.Email,
            request.Password,
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