using ErrorOr;
using MediatR;
using Microsoft.Extensions.Logging;
using Serilog.Context;

namespace DoctorAppointmentSystem.Application.Abstractions.Behaviors;

internal sealed class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseRequest
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = request.GetType().Name;

        try
        {
            _logger.LogInformation("Executing request {RequestName}", requestName);

            var response = await next(cancellationToken);

            if (response is IErrorOr errorOr)
            {
                if (!errorOr.IsError)
                {
                    _logger.LogInformation("Request {RequestName} processed successfully", requestName);
                }
                else
                {
                    using (LogContext.PushProperty("Errors", errorOr.Errors, true))
                    {
                        _logger.LogError("Request {RequestName} processed with error", requestName);
                    }
                }
            }
            else
            {
                _logger.LogInformation("Request {RequestName} processed", requestName);
            }

            return response;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Request {RequestName} processing failed", requestName);
            throw;
        }
    }
}
