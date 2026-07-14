using DoctorAppointmentSystem.Domain.Labs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

public class LabObservationConfiguration : IEntityTypeConfiguration<LabObservation>
{
    public void Configure(EntityTypeBuilder<LabObservation> builder)
    {
        builder.ToTable("LabObservations", Schemas.Default);
        builder.HasKey(x => x.Id);

        // Optional: Ensure the FK relationship is strict
        builder.Property(x => x.LabReportId).IsRequired();
    }
}