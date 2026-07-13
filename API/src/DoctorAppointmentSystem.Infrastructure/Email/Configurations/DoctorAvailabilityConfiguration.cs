using DoctorAppointmentSystem.Domain.Availability;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class DoctorAvailabilityConfiguration : IEntityTypeConfiguration<DoctorAvailability>
{
    public void Configure(EntityTypeBuilder<DoctorAvailability> builder)
    {
        builder.ToTable("doctor_availabilities");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.DoctorUserId).IsRequired();

        builder.HasIndex(x => new { x.DoctorUserId, x.Date }).IsUnique();

        builder.Property(x => x.Date)
            .HasColumnType("date")
            .IsRequired();

        builder.Property(x => x.StartTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(x => x.EndTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(x => x.SlotDurationMinutes).IsRequired();

        builder.Property(x => x.CreatedAtUtc).IsRequired();

        builder.HasMany(x => x.Slots)
            .WithOne(s => s.Availability)
            .HasForeignKey(s => s.AvailabilityId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}