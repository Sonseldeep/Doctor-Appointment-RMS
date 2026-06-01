using DoctorAppointmentSystem.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Database.Configurations;

internal sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles");

        builder.HasKey(role => role.Id);
        builder.HasMany(role => role.Users).WithMany(user => user.Roles);
        builder.Property(r => r.Name).HasMaxLength(100);

        

        builder.HasData(
            Role.Registered,
            Role.Doctor,
            Role.Admin);
    }
}
