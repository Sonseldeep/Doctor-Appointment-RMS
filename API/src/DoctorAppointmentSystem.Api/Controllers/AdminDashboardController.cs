using DoctorAppointmentSystem.Application.Features.Admin.Dashboard.GetDashboardOverview;
using DoctorAppointmentSystem.Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/admin/dashboard")]
[Authorize(Roles = nameof(UserRole.Admin))]
public sealed class AdminDashboardController : ApiController
{
    private readonly ISender _sender;

    public AdminDashboardController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] int trendDays, CancellationToken cancellationToken)
    {
        var query = new GetDashboardOverviewQuery(trendDays == 0 ? 14 : trendDays);
        var result = await _sender.Send(query, cancellationToken);
        return result.Match(Ok, Problem);
    }
}