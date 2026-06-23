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
               .WithOne()
               .HasForeignKey(x => x.LabReportId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}