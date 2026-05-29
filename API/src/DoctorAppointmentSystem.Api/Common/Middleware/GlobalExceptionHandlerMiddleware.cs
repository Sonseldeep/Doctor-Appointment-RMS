using System.Net;
using System.Text.Json;
using DoctorAppointmentSystem.Api.Common;
using DoctorAppointmentSystem.Api.Common.Exceptions;

namespace DoctorAppointmentSystem.Common.Middleware;

public class GlobalExceptionHandlerMiddleware(
    RequestDelegate next,
    ILogger<GlobalExceptionHandlerMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message) = exception switch
        {
            // custom domain exception (you can add later)
            AppException appEx => (appEx.StatusCode, appEx.Message),

            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred")
        };

        var response = ApiResponse<object>.ErrorResponse(message, (HttpStatusCode)statusCode);

        context.Response.StatusCode = statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}