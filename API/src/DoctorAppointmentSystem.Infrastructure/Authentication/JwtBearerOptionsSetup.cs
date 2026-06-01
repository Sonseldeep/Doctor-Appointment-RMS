using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace DoctorAppointmentSystem.Infrastructure.Authentication;

internal sealed class JwtBearerOptionsSetup : IConfigureNamedOptions<JwtBearerOptions>
{
    private readonly AuthenticationOptions _authenticationOptions;
    private readonly JwtBearerEventsHandler _jwtBearerEventsHandler;


    public JwtBearerOptionsSetup(IOptions<AuthenticationOptions> authenticationOptions, JwtBearerEventsHandler jwtBearerEventsHandler)
    {
        _jwtBearerEventsHandler = jwtBearerEventsHandler;
        _authenticationOptions = authenticationOptions.Value;
    }

    public void Configure(JwtBearerOptions options)
    {
        options.Audience = _authenticationOptions.Audience;
        options.MetadataAddress = _authenticationOptions.MetadataUrl;
        options.RequireHttpsMetadata = _authenticationOptions.RequireHttpsMetadata;
        options.TokenValidationParameters.ValidIssuer = _authenticationOptions.Issuer;
        options.Events = _jwtBearerEventsHandler;

    }

    public void Configure(string? name, JwtBearerOptions options)
    {
        Configure(options);
    }
}