using DoctorAppointmentSystem.Domain.Appointments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("appointments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.PatientUserId).IsRequired();
        builder.Property(x => x.DoctorUserId).IsRequired();

        builder.Property(x => x.StartUtc).IsRequired();
        builder.Property(x => x.EndUtc).IsRequired();

        builder.Property(x => x.Notes)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(x => x.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc).IsRequired();

        builder.HasIndex(x => new { x.DoctorUserId, x.StartUtc, x.EndUtc });
        builder.HasIndex(x => new { x.PatientUserId, x.StartUtc });
    }
}