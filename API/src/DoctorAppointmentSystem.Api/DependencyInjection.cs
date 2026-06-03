using DoctorAppointmentSystem.Api.Extensions;

namespace DoctorAppointmentSystem.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration config)
    {
        services.AddControllers();
        
        services.AddProblemDetails();
        
        services.AddHttpContextAccessor();
        
        services.AddSwaggerDependencies();

        services.AddRateLimiting();
        services.AddCorsCollection(config);

        return services;
    }
}


