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
    .AddPresentation()
    .AddInfrastructure(builder.Configuration);

builder.Services.AddCorsCollection();

var app = builder.Build();

app.UseGlobalExceptionHandler();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DoctorAppointmentSystem API");
    });
    
    app.ApplyMigrations();
    
}

app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();

app.UseRequestContextLogging();
app.UseSerilogRequestLogging();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
