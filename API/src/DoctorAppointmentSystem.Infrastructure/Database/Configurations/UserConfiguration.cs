using DoctorAppointmentSystem.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    private const int NameMaxLength = 100;
    private const int EmailMaxLength = 320;
    private const int PasswordHashMaxLength = 300;
    private const int PhotoUrlMaxLength = 500;


    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName)
            .HasMaxLength(NameMaxLength)
            .IsRequired();

        builder.Property(x => x.LastName)
            .HasMaxLength(NameMaxLength)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasMaxLength(EmailMaxLength)
            .IsRequired();

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.Property(x => x.PasswordHash)
            .HasMaxLength(PasswordHashMaxLength)
            .IsRequired();

        builder.Property(x => x.Role)
            .HasConversion<int>()
            .IsRequired();
        
        builder.Property(x => x.TokenVersion)
            .IsRequired();
        
        
        builder.Property(x => x.IsEmailVerified)
            .IsRequired()
            .HasDefaultValue(false);
        
        builder.Property(x => x.ProfilePhotoUrl)
            .HasMaxLength(PhotoUrlMaxLength)
            .IsRequired(false);
        
        builder.Property(x => x.FailedLoginAttempts)
            .IsRequired()
            .HasDefaultValue(0);
        
        builder.Property(x => x.LockedOutUntil)
            .IsRequired(false);
        
        // builder.Property(x => x.PasswordChangeAt)
        //     .IsRequired();
        
    }
}