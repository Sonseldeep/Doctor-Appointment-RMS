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

        const string adminEmail = "sonseldeep.np@gmail.com";
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
            role: UserRole.Admin);

        admin.VerifyEmail();

        await db.Users.AddAsync(admin);
        await db.SaveChangesAsync();

        app.Logger.LogInformation("Seeded default admin user: {Email}", adminEmail);
    }
}