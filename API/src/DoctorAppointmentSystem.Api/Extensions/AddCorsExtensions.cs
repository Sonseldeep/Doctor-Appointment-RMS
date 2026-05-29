namespace DoctorAppointmentSystem.Api.Extensions;

public static class AddCorsExtensions
{
    public static IServiceCollection AddCorsCollection(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                corsPolicyBuilder =>
                {
                    corsPolicyBuilder.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .SetPreflightMaxAge(TimeSpan.FromMinutes(10))
                        .SetIsOriginAllowedToAllowWildcardSubdomains();
                });
        });
        return services;
    }
}