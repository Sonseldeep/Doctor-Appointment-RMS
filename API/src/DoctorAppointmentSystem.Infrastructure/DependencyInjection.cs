
using System.Text;
using DoctorAppointmentSystem.Application.Abstractions.Admin;
using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Email;
using DoctorAppointmentSystem.Application.Abstractions.Jobs;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Abstractions.Otp;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Application.Abstractions.Ratings;
using DoctorAppointmentSystem.Application.Abstractions.Storage;
using DoctorAppointmentSystem.Infrastructure.Abstractions.Authentication;
using DoctorAppointmentSystem.Infrastructure.Database;
using DoctorAppointmentSystem.Infrastructure.Email;
using DoctorAppointmentSystem.Infrastructure.Jobs;
using DoctorAppointmentSystem.Infrastructure.Notifications;
using DoctorAppointmentSystem.Infrastructure.Otp;
using DoctorAppointmentSystem.Infrastructure.Repositories;
using DoctorAppointmentSystem.Infrastructure.Storage;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace DoctorAppointmentSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUnitOfWork>(serviceProvider => serviceProvider.GetRequiredService<ApplicationDbContext>());

        var connectionString = configuration.GetConnectionString("Database") ??
                               throw new ArgumentNullException(nameof(configuration));

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("Database"));
        });

        services.AddScoped<Func<ApplicationDbContext>>(s => () => s.GetRequiredService<ApplicationDbContext>());

        services.AddAuthenticationInfrastructure(configuration);
        services.AddStorageInfrastructure(configuration);
        services.AddHangfireInfrastructure(connectionString);
        services.AddNotificationInfrastructure();
        services.AddRatingInfrastructure();

        return services;
    }

    private static IServiceCollection AddAuthenticationInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));

        var jwtOptions = configuration
            .GetSection(JwtOptions.SectionName)
            .Get<JwtOptions>() ?? throw new InvalidOperationException("Jwt options are missing.");

        var keyBytes = Encoding.UTF8.GetBytes(jwtOptions.Secret);
        var signingKey = new SymmetricSecurityKey(keyBytes);

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwtOptions.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = signingKey,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/hubs/notifications"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    },

                    OnTokenValidated = async context =>
                    {
                        var validator = context.HttpContext.RequestServices.GetRequiredService<TokenVersionValidator>();
                        await validator.ValidateAsync(context);
                    }
                };

            });

        services.AddAuthorization();

        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IRefreshTokenStore, RefreshTokenStore>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddScoped<IRefreshTokenLifetime, RefreshTokenLifetime>();
        services.AddScoped<TokenVersionValidator>();
        

        services.Configure<SecurityOptions>(configuration.GetSection(SecurityOptions.SectionName));
        services.AddScoped<AccountSecurityPolicyProvider>();
        services.AddScoped<IAccountLockoutOptions>(sp => sp.GetRequiredService<AccountSecurityPolicyProvider>());
        services.AddScoped<IPasswordPolicyOptions>(sp => sp.GetRequiredService<AccountSecurityPolicyProvider>());

        
        services.Configure<EmailOptions>(configuration.GetSection(EmailOptions.SectionName));
        services.AddScoped<IEmailService, MailKitEmailService>();

        services.AddScoped<IOtpGenerator, OtpGenerator>();
        services.AddScoped<IOtpStore, OtpStore>();
        services.AddScoped<IOtpRequestLimiter, OtpRequestLimiter>();

        services.AddScoped<IDoctorProfileRepository, DoctorProfileRepository>();
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();

        services.AddScoped<IPatientProfileRepository, PatientProfileRepository>();
        services.AddScoped<IDoctorAvailabilityRepository, DoctorAvailabilityRepository>();
        services.AddScoped<IClinicalNoteRepository, ClinicalNoteRepository>();

        services.AddScoped<ILabReportRepository, LabReportRepository>();

        services.AddHttpContextAccessor();
        services.AddScoped<IUserContext, UserContext>();
        services.AddScoped<IMedicalRecordAccessLogRepository, MedicalRecordAccessLogRepository>();
        services.AddScoped<IDashboardRepository, DashboardRepository>();


        return services;
    }

    private static IServiceCollection AddStorageInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<CloudinaryOptions>(
            configuration.GetSection(CloudinaryOptions.SectionName));

        services.AddScoped<IFileStorageService, CloudinaryFileStorageService>();

        return services;
    }

    private static IServiceCollection AddHangfireInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddHangfire(config => config
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UseSqlServerStorage(connectionString));

        services.AddHangfireServer();

        // Job registrations
        services.AddScoped<IAppointmentReminderJob, AppointmentReminderJob>();
        services.AddScoped<IAppointmentScheduler, HangfireAppointmentScheduler>();

        return services;
    }

    private static IServiceCollection AddNotificationInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<INotificationService, SignalRNotificationService>();

        return services;
    }

    private static IServiceCollection AddRatingInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IRatingRepository, RatingRepository>();
        services.AddScoped<IRatingSummaryRepository, RatingSummaryRepository>();
        return services;
    }
}