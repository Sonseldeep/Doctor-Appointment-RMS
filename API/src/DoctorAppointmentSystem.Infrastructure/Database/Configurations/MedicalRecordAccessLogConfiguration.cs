using DoctorAppointmentSystem.Domain.Labs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

public sealed class MedicalRecordAccessLogConfiguration : IEntityTypeConfiguration<MedicalRecordAccessLog>
{
    public void Configure(EntityTypeBuilder<MedicalRecordAccessLog> builder)
    {
        // Fallback to default schema automatically by omitting the second argument,
        // or explicitly using Schemas.Default if you prefer strict typing.
        builder.ToTable("medical_record_access_logs");

        builder.HasKey(log => log.Id);

        builder.Property(log => log.DoctorUserId)
            .IsRequired();

        builder.Property(log => log.PatientUserId)
            .IsRequired();

        builder.Property(log => log.ActionTaken)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(log => log.IpAddress)
            .HasMaxLength(45) // Provides optimal native support lengths for complex IPv6 strings
            .IsRequired();

        builder.Property(log => log.AccessedAtUtc)
            .IsRequired();
    }
}