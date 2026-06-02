using ErrorOr;
using MediatR;

namespace DoctorAppointmentSystem.Application.Abstractions.Messaging;

public interface ICommand : IRequest<ErrorOr<Success>>, IBaseCommand
{
}

public interface ICommand<TResponse> : IRequest<ErrorOr<TResponse>>, IBaseCommand
{
}

public interface IBaseCommand
{
}