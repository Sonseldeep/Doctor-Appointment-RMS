using DoctorAppointmentSystem.Application.Abstractions.Notifications;
using DoctorAppointmentSystem.Application.Common;
using DoctorAppointmentSystem.Application.Features.Notifications.Contracts;
using DoctorAppointmentSystem.Application.Features.Notifications.GetMyNotifications;
using DoctorAppointmentSystem.Domain.Notifications;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class NotificationRepository : INotificationRepository
{
    private readonly ApplicationDbContext _context;

    public NotificationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        await _context.Notifications.AddAsync(notification, cancellationToken);
    }

    public async Task<List<Notification>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAtUtc)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }


    public async Task<PagedResult<NotificationResponse>> GetByUserIdPagedAsync(
        GetMyNotificationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var notifications = _context.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == query.UserId);

        if (query.IsRead.HasValue)
        {
            notifications = notifications.Where(n => n.IsRead == query.IsRead.Value);
        }

        var totalCount = await notifications.CountAsync(cancellationToken);

        var items = await notifications
            .OrderByDescending(n => n.CreatedAtUtc)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(n => new NotificationResponse(
                n.Id,
                n.Title,
                n.Message,
                n.Type.ToString(),
                n.AppointmentId,
                n.IsRead,
                n.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        return new PagedResult<NotificationResponse>(
            Items: items.AsReadOnly(),
            TotalCount: totalCount,
            Page: query.Page,
            PageSize: query.PageSize);
    }
    
    public async Task<Notification?> GetByIdAsync(
        Guid notificationId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId, cancellationToken);
    }

    public async Task<int> MarkAllAsReadAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(n => n.IsRead, true),
                cancellationToken);
    }
}