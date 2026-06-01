using System.Net;
using System.Net.Http.Json;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Infrastructure.Authentication.Models;
using ErrorOr;
using Microsoft.Extensions.Options;

namespace DoctorAppointmentSystem.Infrastructure.Authentication;

internal sealed class JwtService : IJwtService
{
    private static readonly Error InvalidCredentials = Error.Unauthorized(
        code: "Keycloak.InvalidCredentials",
        description: "Invalid email or password.");

    private static readonly Error AuthenticationFailed = Error.Failure(
        code: "Keycloak.AuthenticationFailed",
        description: "Failed to acquire access token from Keycloak.");

    private static readonly Error RefreshFailed = Error.Unauthorized(
        code: "Keycloak.RefreshFailed",
        description: "Refresh token expired. Please log in again.");

    private readonly HttpClient _httpClient;
    private readonly KeycloakOptions _keycloakOptions;

    public JwtService(HttpClient httpClient, IOptions<KeycloakOptions> keycloakOptions)
    {
        _httpClient = httpClient;
        _keycloakOptions = keycloakOptions.Value;
    }

    public async Task<ErrorOr<TokenResponse>> GetAccessTokenAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var parameters = new KeyValuePair<string, string>[]
        {
            new("client_id", _keycloakOptions.AuthClientId),
            new("client_secret", _keycloakOptions.AuthClientSecret),
            new("scope", "openid email"),
            new("grant_type", "password"),
            new("username", email),
            new("password", password)
        };

        return await PostToKeycloakAsync(
            parameters,
            InvalidCredentials,
            cancellationToken);
    }

    public async Task<ErrorOr<TokenResponse>> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default)
    {
        var parameters = new KeyValuePair<string, string>[]
        {
            new("client_id", _keycloakOptions.AuthClientId),
            new("client_secret", _keycloakOptions.AuthClientSecret),
            new("grant_type", "refresh_token"),
            new("refresh_token", refreshToken)
        };

        return await PostToKeycloakAsync(
            parameters,
            RefreshFailed,
            cancellationToken);
    }

    private async Task<ErrorOr<TokenResponse>> PostToKeycloakAsync(
        KeyValuePair<string, string>[] parameters,
        Error unauthorizedError,
        CancellationToken cancellationToken)
    {
        using var content = new FormUrlEncodedContent(parameters);

        HttpResponseMessage response;

        try
        {
            response = await _httpClient.PostAsync("", content, cancellationToken);
        }
        catch (HttpRequestException)
        {
            return AuthenticationFailed;
        }
        catch (TaskCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            return AuthenticationFailed;
        }

        if (response.StatusCode is HttpStatusCode.BadRequest
            or HttpStatusCode.Unauthorized)
        {
            return unauthorizedError;
        }

        if (!response.IsSuccessStatusCode)
            return AuthenticationFailed;

        AuthorizationToken? token;

        try
        {
            token = await response.Content
                .ReadFromJsonAsync<AuthorizationToken>(cancellationToken);
        }
        catch
        {
            return AuthenticationFailed;
        }

        if (token is null || string.IsNullOrWhiteSpace(token.AccessToken))
            return AuthenticationFailed;

        return new TokenResponse(
            token.AccessToken,
            token.RefreshToken,
            token.ExpiresIn,
            token.RefreshExpiresIn);
    }
}