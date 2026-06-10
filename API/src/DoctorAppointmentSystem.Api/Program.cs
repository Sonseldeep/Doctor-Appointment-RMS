using DoctorAppointmentSystem.Api;
using DoctorAppointmentSystem.Api.Extensions;
using DoctorAppointmentSystem.Application;
using DoctorAppointmentSystem.Infrastructure;
using Hangfire;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) => 
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services
    .AddApplication()
    .AddPresentation(builder.Configuration)
    .AddInfrastructure(builder.Configuration);


var app = builder.Build();

app.UseGlobalExceptionHandler();
app.UseHttpsRedirection();


if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DoctorAppointmentSystem API");
    });
    
    app.ApplyMigrations();
    await app.SeedAdminUserAsync();

}

app.UseCors("AllowSpecificOrigin");

app.UseRequestContextLogging();
app.UseSerilogRequestLogging();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard("/hangfire");
app.MapControllers();

app.Run();
