using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DoctorAppointmentSystem.Api.Common.Authentication;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class ApiKeyAttribute : Attribute, IAsyncActionFilter
{
    private const string ApiKeyHeaderName = "X-Lab-Access-Key";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue(ApiKeyHeaderName, out var extractedApiKey))
        {
            context.Result = new ContentResult { StatusCode = 401, Content = "B2B Security Header missing." };
            return;
        }

        var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var apiKey = configuration.GetValue<string>("LabIntegrationSettings:SecretKey");

        if (!apiKey.Equals(extractedApiKey))
        {
            context.Result = new ContentResult { StatusCode = 403, Content = "Unauthorized Client Context." };
            return;
        }

        await next();
    }
}