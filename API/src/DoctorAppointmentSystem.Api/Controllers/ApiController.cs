using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DoctorAppointmentSystem.Api.Controllers;

[ApiController]
public abstract class ApiController : ControllerBase
{
    protected bool TryGetCurrentUserId(out Guid userId)
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(value, out userId);
    }

    protected IActionResult Problem(List<Error> errors)
    {
        if (errors.Count == 0)
        {
            return Problem();
        }

        if (errors.All(e => e.Type == ErrorType.Validation))
        {
            return ValidationProblem(errors);
        }

        return Problem(errors[0]);
    }

    protected IActionResult Problem(Error error)
    {
        var statusCode = error.Code switch
        {
            "Otp.TooManyRequests" => StatusCodes.Status429TooManyRequests,
            _ => error.Type switch
            {
                ErrorType.Validation => StatusCodes.Status400BadRequest,
                ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
                ErrorType.Forbidden => StatusCodes.Status403Forbidden,
                ErrorType.NotFound => StatusCodes.Status404NotFound,
                ErrorType.Conflict => StatusCodes.Status409Conflict,
                _ => StatusCodes.Status500InternalServerError
            }
        };

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = error.Code == "Otp.TooManyRequests"
                ? "Too many requests"
                : "Request failed",
            Type = error.Code,
            Detail = error.Description
        };

        if (error.Metadata is not null)
        {
            foreach (var (key, value) in error.Metadata)
            {
                problemDetails.Extensions[key] = value;
            }
        }

        return StatusCode(statusCode, problemDetails);
    }

    private IActionResult ValidationProblem(List<Error> errors)
    {
        var modelStateDictionary = new ModelStateDictionary();

        foreach (var error in errors)
        {
            modelStateDictionary.AddModelError(error.Code, error.Description);
        }

        return ValidationProblem(new ValidationProblemDetails(modelStateDictionary)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation error",
            Type = "ValidationFailure",
            Detail = "One or more validation errors occurred."
        });
    }
}