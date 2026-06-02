using DoctorAppointmentSystem.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class OtpRequestLimitConfiguration : IEntityTypeConfiguration<OtpRequestLimit>
{
    public void Configure(EntityTypeBuilder<OtpRequestLimit> builder)
    {
        builder.ToTable("otp_request_limits");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(320);

        builder.Property(x => x.Purpose).IsRequired();
        builder.Property(x => x.WindowStartUtc).IsRequired();
        builder.Property(x => x.RequestCount).IsRequired();

        builder.HasIndex(x => new { x.Email, x.Purpose }).IsUnique();
    }
}