using DoctorAppointmentSystem.Api.Extensions;

namespace DoctorAppointmentSystem.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddControllers();
        

        services.AddProblemDetails(options =>
        {
            options.CustomizeProblemDetails = context =>
            {
                context.ProblemDetails.Instance = 
                    $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
        
                context.ProblemDetails.Extensions.TryAdd(
                    "requestId", context.HttpContext.TraceIdentifier);
            };
        });
        
        services.AddHttpContextAccessor();
        
        services.AddSwaggerDependencies();

        return services;
    }
}