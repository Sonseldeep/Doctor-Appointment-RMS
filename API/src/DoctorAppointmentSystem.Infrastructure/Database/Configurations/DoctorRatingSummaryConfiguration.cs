using DoctorAppointmentSystem.Domain.Ratings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class DoctorRatingSummaryConfiguration
    : IEntityTypeConfiguration<DoctorRatingSummary>
{
    public void Configure(EntityTypeBuilder<DoctorRatingSummary> builder)
    {
        builder.ToTable("doctor_rating_summaries");

        builder.HasKey(s => s.Id);
        
        builder.UsePropertyAccessMode(PropertyAccessMode.PreferFieldDuringConstruction);


        builder.Property(s => s.DoctorUserId)
            .IsRequired();
        
        builder.HasIndex(s => s.DoctorUserId)
            .IsUnique()
            .HasDatabaseName("IX_doctor_rating_summaries_doctor_unique");

        builder.Property(s => s.TotalRatings)
            .IsRequired();
        
        builder.Property(s => s.RatingSum)
            .IsRequired();
        
        builder.Property(s => s.LastUpdatedAtUtc)
            .IsRequired();

        builder.Ignore(s => s.AverageRating);
    }
}