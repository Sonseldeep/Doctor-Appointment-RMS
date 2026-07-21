using DoctorAppointmentSystem.Domain.Labs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

public class LabReportConfiguration : IEntityTypeConfiguration<LabReport>
{
    public void Configure(EntityTypeBuilder<LabReport> builder)
    {
        builder.ToTable("LabReports", Schemas.Default);
        builder.HasKey(x => x.Id);

        builder.HasMany(x => x.Observations)
            .WithOne(o => o.LabReport)
            .HasForeignKey(o => o.LabReportId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Documents)
            .WithOne(d => d.LabReport)
            .HasForeignKey(d => d.LabReportId)
            .OnDelete(DeleteBehavior.Cascade);
        
        
        builder.HasIndex(x => x.SentByLabTechnicianId);

    }
}