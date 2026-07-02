using DoctorAppointmentSystem.Application.Abstractions.Admin;
using DoctorAppointmentSystem.Application.Features.Admin.Dashboard.Contracts;
using DoctorAppointmentSystem.Application.Features.Admin.Dashboard.GetDashboardOverview;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

internal sealed class DashboardRepository : IDashboardRepository
{
    private readonly ApplicationDbContext _db;

    public DashboardRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardOverviewResponse> GetOverviewAsync(
        GetDashboardOverviewQuery query,
        CancellationToken cancellationToken)
    {
        var utcNow = DateTimeOffset.UtcNow;
        var todayUtc = new DateTimeOffset(utcNow.Year, utcNow.Month, utcNow.Day, 0, 0, 0, TimeSpan.Zero);
        var trendStartUtc = todayUtc.AddDays(-(query.TrendDays - 1));

        var users = await GetUserOverviewAsync(cancellationToken);
        var doctors = await GetDoctorOverviewAsync(cancellationToken);
        var appointments = await GetAppointmentOverviewAsync(todayUtc, cancellationToken);
        var appointmentTrend = await GetAppointmentTrendAsync(trendStartUtc, query.TrendDays, cancellationToken);
        var topRatedDoctors = await GetTopRatedDoctorsAsync(cancellationToken);

        return new DashboardOverviewResponse(
            users,
            doctors,
            appointments,
            appointmentTrend,
            topRatedDoctors,
            utcNow);
    }

    private async Task<UserOverviewResponse> GetUserOverviewAsync(CancellationToken cancellationToken)
    {
        var roleCounts = await _db.Users
            .AsNoTracking()
            .GroupBy(u => u.Role)
            .Select(g => new { Role = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        int CountFor(UserRole role) => roleCounts.SingleOrDefault(x => x.Role == role)?.Count ?? 0;

        return new UserOverviewResponse(
            TotalPatients: CountFor(UserRole.Registered),
            TotalDoctors: CountFor(UserRole.Doctor));
    }

    private async Task<DoctorOverviewResponse> GetDoctorOverviewAsync(CancellationToken cancellationToken)
    {
        var statusCounts = await _db.DoctorProfiles
            .AsNoTracking()
            .GroupBy(d => d.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        int CountFor(DoctorStatus status) => statusCounts.SingleOrDefault(x => x.Status == status)?.Count ?? 0;

        return new DoctorOverviewResponse(
            TotalDoctors: statusCounts.Sum(x => x.Count),
            PendingApproval: CountFor(DoctorStatus.Pending),
            Active: CountFor(DoctorStatus.Active),
            Suspended: CountFor(DoctorStatus.Suspended));
    }

    private async Task<AppointmentOverviewResponse> GetAppointmentOverviewAsync(
        DateTimeOffset todayStartUtc,
        CancellationToken cancellationToken)
    {
        var statusCounts = await _db.Appointments
            .AsNoTracking()
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var todayEndUtc = todayStartUtc.AddDays(1);

        var today = await _db.Appointments
            .AsNoTracking()
            .CountAsync(a => a.StartUtc >= todayStartUtc && a.StartUtc < todayEndUtc, cancellationToken);

        int CountFor(AppointmentStatus status) => statusCounts.SingleOrDefault(x => x.Status == status)?.Count ?? 0;

        return new AppointmentOverviewResponse(
            Total: statusCounts.Sum(x => x.Count),
            Pending: CountFor(AppointmentStatus.Pending),
            Confirmed: CountFor(AppointmentStatus.Confirmed),
            Cancelled: CountFor(AppointmentStatus.Cancelled),
            Completed: CountFor(AppointmentStatus.Completed),
            Today: today);
    }

    private async Task<IReadOnlyList<AppointmentTrendPointResponse>> GetAppointmentTrendAsync(
        DateTimeOffset trendStartUtc,
        int trendDays,
        CancellationToken cancellationToken)
    {
        var rows = await _db.Appointments
            .AsNoTracking()
            .Where(a =>
                a.CreatedAtUtc >= trendStartUtc ||
                a.CompletedAtUtc >= trendStartUtc ||
                a.CancelledAtUtc >= trendStartUtc)
            .Select(a => new { a.CreatedAtUtc, a.CompletedAtUtc, a.CancelledAtUtc })
            .ToListAsync(cancellationToken);

        var trend = new List<AppointmentTrendPointResponse>(trendDays);

        for (var i = 0; i < trendDays; i++)
        {
            var day = DateOnly.FromDateTime(trendStartUtc.AddDays(i).UtcDateTime);

            var booked = rows.Count(r => DateOnly.FromDateTime(r.CreatedAtUtc.UtcDateTime) == day);
            var completed = rows.Count(r => r.CompletedAtUtc.HasValue && DateOnly.FromDateTime(r.CompletedAtUtc.Value.UtcDateTime) == day);
            var cancelled = rows.Count(r => r.CancelledAtUtc.HasValue && DateOnly.FromDateTime(r.CancelledAtUtc.Value.UtcDateTime) == day);

            trend.Add(new AppointmentTrendPointResponse(day, booked, completed, cancelled));
        }

        return trend;
    }

    private async Task<IReadOnlyList<TopRatedDoctorResponse>> GetTopRatedDoctorsAsync(CancellationToken cancellationToken)
    {
        return await _db.DoctorRatingSummaries
            .AsNoTracking()
            .Where(s => s.TotalRatings > 0)
            .Join(
                _db.DoctorProfiles.AsNoTracking(),
                s => s.DoctorUserId,
                d => d.UserId,
                (s, d) => new { s, d })
            .Join(
                _db.Users.AsNoTracking(),
                x => x.d.UserId,
                u => u.Id,
                (x, u) => new { x.s, x.d, u })
            .OrderByDescending(x => (double)x.s.RatingSum / x.s.TotalRatings)
            .ThenByDescending(x => x.s.TotalRatings)
            .Take(5)
            .Select(x => new TopRatedDoctorResponse(
                x.d.UserId,
                $"Dr. {x.u.FirstName} {x.u.LastName}",
                x.d.Specialization,
                Math.Round((decimal)x.s.RatingSum / x.s.TotalRatings, 1),
                x.s.TotalRatings))
            .ToListAsync(cancellationToken);
    }
}