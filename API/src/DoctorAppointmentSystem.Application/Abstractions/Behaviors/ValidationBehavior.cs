using ErrorOr;
using FluentValidation;
using MediatR;

namespace DoctorAppointmentSystem.Application.Abstractions.Behaviors;

internal sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next(cancellationToken);
        }

        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();


        if (failures.Count != 0)
        {
            var errors = failures
                .ConvertAll(f => Error.Validation(
                    code: f.PropertyName,
                    description: f.ErrorMessage));

            return (dynamic)errors;
        }

        return await next(cancellationToken);
    }
}
