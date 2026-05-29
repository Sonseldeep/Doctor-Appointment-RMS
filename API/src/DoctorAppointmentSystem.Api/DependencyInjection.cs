using DoctorAppointmentSystem.Api.Extensions;

namespace DoctorAppointmentSystem.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddControllers();
        
        services.AddProblemDetails();
        
        services.AddHttpContextAccessor();
        
        services.AddSwaggerDependencies();

        return services;
    }
}