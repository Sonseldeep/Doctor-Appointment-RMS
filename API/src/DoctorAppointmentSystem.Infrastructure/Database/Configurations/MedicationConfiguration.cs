using DoctorAppointmentSystem.Domain.ClinicalNotes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class MedicationConfiguration : IEntityTypeConfiguration<Medication>
{
    public void Configure(EntityTypeBuilder<Medication> builder)
    {
        builder.ToTable("clinical_note_medications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ClinicalNoteId).IsRequired();

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Dosage)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Frequency)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.DurationInDays)
            .IsRequired(false);

        builder.Property(x => x.Instructions)
            .HasMaxLength(500)
            .IsRequired(false);

        builder.HasIndex(x => x.ClinicalNoteId);
    }
}
