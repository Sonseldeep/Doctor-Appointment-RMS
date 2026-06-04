using DoctorAppointmentSystem.Domain.Patients;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class PatientProfileConfiguration : IEntityTypeConfiguration<PatientProfile>
{
    public void Configure(EntityTypeBuilder<PatientProfile> builder)
    {
        builder.ToTable("patient_profiles");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.UserId).IsRequired();
        builder.HasIndex(x => x.UserId).IsUnique();

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(30)
            .IsRequired(false);

        builder.Property(x => x.Address)
            .HasMaxLength(500)
            .IsRequired(false);

        builder.Property(x => x.Sex)
            .HasConversion<int>()  
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc).IsRequired();
    }
}