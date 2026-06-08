using DoctorAppointmentSystem.Domain.Doctor;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class DoctorProfileConfiguration : IEntityTypeConfiguration<DoctorProfile>
{
    public void Configure(EntityTypeBuilder<DoctorProfile> builder)
    {
        builder.ToTable("doctor_profiles");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.UserId).IsRequired();
        builder.HasIndex(x => x.UserId).IsUnique();

        builder.Property(x => x.Bio)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(x => x.Specialization)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(x => x.ConsultationFee)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();
        
        
        builder.HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<DoctorProfile>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}