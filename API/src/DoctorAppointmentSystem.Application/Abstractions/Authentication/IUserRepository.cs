using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Application.Abstractions.Authentication;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);

    Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken);

    Task AddAsync(User user, CancellationToken cancellationToken);
}