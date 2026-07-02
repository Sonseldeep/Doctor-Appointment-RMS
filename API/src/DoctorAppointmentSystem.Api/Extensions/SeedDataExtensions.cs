using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Api.Extensions;

public static class SeedDataExtensions
{
    public static async Task SeedAdminUserAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        const string adminEmail = "admin@admin.com";
        const string adminPassword = "Admin@12345";

        var adminExists = await db.Users.AnyAsync(u => u.Role == UserRole.Admin);
        if (adminExists)
        {
            return;
        }
            

        var passwordHash = passwordHasher.Hash(adminPassword);

        var admin = User.Create(
            firstName: "System",
            lastName: "Admin",
            email: adminEmail,
            passwordHash: passwordHash,
            role: UserRole.Admin,
            now: DateTime.Now);

        admin.VerifyEmail();

        await db.Users.AddAsync(admin);
        await db.SaveChangesAsync();

        app.Logger.LogInformation("Seeded default admin user: {Email}", adminEmail);
    }
    
    

    public static async Task SeedLabTechnicianUserAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        const string labTechEmail = "labtech@labtech.com";
        const string labTechPassword = "LabTech@12345";

        var labTechExists = await db.Users.AnyAsync(u => u.Role == UserRole.LabTechnician);
        if (labTechExists)
        {
            return;
        }

        var passwordHash = passwordHasher.Hash(labTechPassword);

        var labTechnician = User.Create(
            firstName: "Lab",
            lastName: "Technician",
            email: labTechEmail,
            passwordHash: passwordHash,
            role: UserRole.LabTechnician,
            now: DateTime.Now);

        labTechnician.VerifyEmail();

        await db.Users.AddAsync(labTechnician);
        await db.SaveChangesAsync();

        app.Logger.LogInformation("Seeded default lab technician user: {Email}", labTechEmail);
    }
}