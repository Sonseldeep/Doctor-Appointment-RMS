using DoctorAppointmentSystem.Domain.Labs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

public class LabReportDocumentConfiguration : IEntityTypeConfiguration<LabReportDocument>
{
    public void Configure(EntityTypeBuilder<LabReportDocument> builder)
    {
        builder.ToTable("LabReportDocuments", Schemas.Default);
        builder.HasKey(x => x.Id);

        builder.Property(x => x.DocumentUrl)
            .HasMaxLength(2048)
            .IsRequired();

        builder.Property(x => x.FileName)
            .HasMaxLength(260) 
            .IsRequired();

        builder.Property(x => x.DocumentType)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.MimeType)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(x => x.LabReportId);
    }
}