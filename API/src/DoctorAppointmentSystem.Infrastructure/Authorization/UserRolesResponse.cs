using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Infrastructure.Authorization;

internal sealed class UserRolesResponse
{
    public Guid UserId { get; init; }
    public List<Role> Roles { get; init; } = [];
}