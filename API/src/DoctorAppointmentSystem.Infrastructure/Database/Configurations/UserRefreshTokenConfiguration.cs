using DoctorAppointmentSystem.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class UserRefreshTokenConfiguration : IEntityTypeConfiguration<UserRefreshToken>
{
    private const int TokenHashMaxLength = 200;

    public void Configure(EntityTypeBuilder<UserRefreshToken> builder)
    {
        builder.ToTable("user_refresh_tokens");

        builder.HasKey(x => x.UserId);

        builder.Property(x => x.TokenHash)
            .HasMaxLength(TokenHashMaxLength)
            .IsRequired();

        builder.Property(x => x.ExpiresAt)
            .IsRequired();

        builder.Property(x => x.RevokedAt);

        builder.HasOne<User>()
            .WithOne()
            .HasForeignKey<UserRefreshToken>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}