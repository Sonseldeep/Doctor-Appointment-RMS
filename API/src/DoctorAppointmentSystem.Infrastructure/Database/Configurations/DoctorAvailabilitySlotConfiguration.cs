using DoctorAppointmentSystem.Domain.Availability;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class DoctorAvailabilitySlotConfiguration : IEntityTypeConfiguration<DoctorAvailabilitySlot>
{
    public void Configure(EntityTypeBuilder<DoctorAvailabilitySlot> builder)
    {
        builder.ToTable("doctor_availability_slots");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AvailabilityId).IsRequired();

        builder.Property(x => x.StartTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(x => x.EndTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(x => x.IsBooked)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.AppointmentId)
            .IsRequired(false);

        builder.HasIndex(x => x.AppointmentId);

    }
}