using DoctorAppointmentSystem.Domain.ClinicalNotes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class ClinicalNoteConfiguration : IEntityTypeConfiguration<ClinicalNote>
{
    public void Configure(EntityTypeBuilder<ClinicalNote> builder)
    {
        builder.ToTable("clinical_notes");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AppointmentId).IsRequired();
        builder.Property(x => x.DoctorUserId).IsRequired();
        builder.Property(x => x.PatientUserId).IsRequired();

        builder.Property(x => x.Diagnosis)
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(x => x.Observations)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(x => x.TreatmentSummary)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(x => x.FollowUpDate)
            .IsRequired(false);

        builder.Property(x => x.FollowUpInstructions)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder.Property(x => x.CreatedAtUtc).IsRequired();
        builder.Property(x => x.UpdatedAtUtc).IsRequired();

        builder.HasIndex(x => x.AppointmentId).IsUnique();
        builder.HasIndex(x => x.PatientUserId);
        builder.HasIndex(x => x.DoctorUserId);

        builder.HasMany(x => x.Medications)
            .WithOne()
            .HasForeignKey(m => m.ClinicalNoteId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder.Navigation(x => x.Medications)
            .UsePropertyAccessMode(PropertyAccessMode.Field)
            .HasField("_medications");
    }
}

