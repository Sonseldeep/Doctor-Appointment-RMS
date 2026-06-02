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
        if (error.Code == "Otp.TooManyRequests")
        {
            return Problem(
                statusCode: StatusCodes.Status429TooManyRequests,
                title: "Too many requests",
                type: error.Code,
                detail: error.Description);
        }

        var statusCode = error.Type switch
        {
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
            ErrorType.Forbidden => StatusCodes.Status403Forbidden,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError
        };

        return Problem(
            statusCode: statusCode,
            title: "Request failed",
            type: error.Code,
            detail: error.Description);
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