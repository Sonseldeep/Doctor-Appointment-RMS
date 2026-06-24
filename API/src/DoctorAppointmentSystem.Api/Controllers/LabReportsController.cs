//using DoctorAppointmentSystem.Api.Controllers;
//using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports; // Make sure this is here!
//using MediatR;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace DoctorAppointmentSystem.Api.Controllers;

//[Route("api/lab-reports")]
//[Authorize]
//public sealed class LabReportsController : ApiController
//{
//    private readonly ISender _sender;
//    public LabReportsController(ISender sender) => _sender = sender;

//    [HttpGet]
//    public async Task<IActionResult> GetMyReports(CancellationToken cancellationToken)
//    {
//        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

//        var result = await _sender.Send(new GetLabReportsQuery(userId), cancellationToken);

//        // This explicit lambda fixes the CS0123 error
//        return result.Match(
//            value => Ok(value),
//            errors => Problem(errors)
//        );
//    }
//}

using DoctorAppointmentSystem.Api.Controllers;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.Api.Controllers;

[Route("api/lab-reports")]
[Authorize]
public sealed class LabReportsController : ApiController
{
    private readonly ISender _sender;
    public LabReportsController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<IActionResult> GetMyReports(CancellationToken cancellationToken)
    {
        if (!TryGetCurrentUserId(out var userId)) return Unauthorized();

        var result = await _sender.Send(new GetLabReportsQuery(userId), cancellationToken);

        return result.Match(
            value => Ok(value),
            errors => Problem(errors)
        );
    }
}