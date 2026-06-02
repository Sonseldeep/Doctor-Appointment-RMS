using DoctorAppointmentSystem.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

public sealed class UserOtpConfiguration : IEntityTypeConfiguration<UserOtp>
{
    private const int OtpHashMaxLength = 200;

    public void Configure(EntityTypeBuilder<UserOtp> builder)
    {
        builder.ToTable("user_otps");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.OtpHash)
            .HasMaxLength(OtpHashMaxLength)
            .IsRequired();

        builder.Property(x => x.ExpiresAt)
            .IsRequired();

        builder.Property(x => x.UsedAt);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
