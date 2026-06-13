using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Availability;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Domain.Ratings;
using DoctorAppointmentSystem.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Database;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    public DbSet<User> Users => Set<User>();
    public DbSet<UserRefreshToken> UserRefreshTokens => Set<UserRefreshToken>();

    public DbSet<UserOtp> UserOtps => Set<UserOtp>();
    public DbSet<OtpRequestLimit> OtpRequestLimits => Set<OtpRequestLimit>();
    
    public DbSet<DoctorProfile> DoctorProfiles => Set<DoctorProfile>();

    public DbSet<Appointment> Appointments => Set<Appointment>();
    
    public DbSet<PatientProfile> PatientProfiles => Set<PatientProfile>();
    
    public DbSet<DoctorAvailability> DoctorAvailabilities => Set<DoctorAvailability>();

    public DbSet<DoctorAvailabilitySlot> DoctorAvailabilitySlots => Set<DoctorAvailabilitySlot>();
    
    public DbSet<Notification> Notifications => Set<Notification>();
    
    public DbSet<DoctorRating> DoctorRatings => Set<DoctorRating>();
    public DbSet<DoctorRatingSummary> DoctorRatingSummaries => Set<DoctorRatingSummary>();


    
    
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        modelBuilder.HasDefaultSchema(Schemas.Default);
    }
    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
       
    }
}