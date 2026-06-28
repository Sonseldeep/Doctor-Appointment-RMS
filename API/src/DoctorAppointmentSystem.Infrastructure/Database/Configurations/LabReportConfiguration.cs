//using DoctorAppointmentSystem.Domain.Labs;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

//public class LabReportConfiguration : IEntityTypeConfiguration<LabReport>
//{
//    public void Configure(EntityTypeBuilder<LabReport> builder)
//    {
//        builder.ToTable("LabReports", Schemas.Default);
//        builder.HasKey(x => x.Id);

//        builder.HasMany(x => x.Observations)
//               .WithOne()
//               .HasForeignKey(x => x.LabReportId)
//               .OnDelete(DeleteBehavior.Cascade);
//    }
//}

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

        // Configure new Document Metadata columns
        builder.Property(x => x.DocumentUrl)
               .HasMaxLength(2048) // Standard max URL length
               .IsRequired(false);

        builder.Property(x => x.DocumentType)
               .HasMaxLength(50)
               .IsRequired(false);

        builder.Property(x => x.MimeType)
               .HasMaxLength(100)
               .IsRequired(false);

        builder.HasMany(x => x.Observations)
               .WithOne(o => o.LabReport)
               .HasForeignKey(o => o.LabReportId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}