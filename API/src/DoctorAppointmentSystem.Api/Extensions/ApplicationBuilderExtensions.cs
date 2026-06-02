using DoctorAppointmentSystem.Api.Common.Middleware;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    
    public static void UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
    }

    public static void UseRequestContextLogging(this IApplicationBuilder app)
    {
        app.UseMiddleware<RequestContextLoggingMiddleware>();
    }

    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        using var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.Migrate();
    }
}