using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _dbContext;

    public UserRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _dbContext.Users.SingleOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
    }
}