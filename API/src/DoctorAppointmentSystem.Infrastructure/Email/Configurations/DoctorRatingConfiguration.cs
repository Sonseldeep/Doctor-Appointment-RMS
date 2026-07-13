using DoctorAppointmentSystem.Domain.Ratings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class DoctorRatingConfiguration : IEntityTypeConfiguration<DoctorRating>
{
    public void Configure(EntityTypeBuilder<DoctorRating> builder)
    {
        builder.ToTable("doctor_ratings");

        builder.HasKey(r => r.Id);
        
        builder.UsePropertyAccessMode(PropertyAccessMode.PreferFieldDuringConstruction);


        builder.Property(r => r.DoctorUserId)
            .IsRequired();
        
        builder.Property(r => r.PatientUserId)
            .IsRequired();

        builder.Property(r => r.Stars)
            .IsRequired();

        builder.Property(r => r.Comment)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder.Property(r => r.CreatedAtUtc)
            .IsRequired();
        
        builder.Property(r => r.UpdatedAtUtc)
            .IsRequired();

        builder.HasIndex(r => new { r.PatientUserId, r.DoctorUserId })
            .IsUnique()
            .HasDatabaseName("IX_doctor_ratings_patient_doctor_unique");

        builder.HasIndex(r => r.DoctorUserId)
            .HasDatabaseName("IX_doctor_ratings_doctor");
    }
}