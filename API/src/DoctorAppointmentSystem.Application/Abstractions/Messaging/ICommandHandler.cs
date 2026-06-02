
using ErrorOr;
using MediatR;

namespace DoctorAppointmentSystem.Application.Abstractions.Messaging;

public interface ICommandHandler<TCommand> : IRequestHandler<TCommand, ErrorOr<Success>>
    where TCommand : ICommand
{
}

public interface ICommandHandler<TCommand, TResponse> : IRequestHandler<TCommand, ErrorOr<TResponse>>
    where TCommand : ICommand<TResponse>
{
}