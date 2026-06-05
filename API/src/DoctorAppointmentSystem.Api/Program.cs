using DoctorAppointmentSystem.Api;
using DoctorAppointmentSystem.Api.Extensions;
using DoctorAppointmentSystem.Application;
using DoctorAppointmentSystem.Infrastructure;
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

app.MapControllers();

app.Run();
