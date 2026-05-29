// using DoctorAppointmentSystem.Domain.Abstractions;
// using MediatR;
//
// namespace DoctorAppointmentSystem.Application.Abstractions.Messaging;
//
// public interface IQueryHandler<TQuery, TResponse> : IRequestHandler<TQuery, Result<TResponse>>
//     where TQuery : IQuery<TResponse>
// {
// }


using ErrorOr;
using MediatR;

namespace DoctorAppointmentSystem.Application.Abstractions.Messaging;

public interface IQueryHandler<TQuery, TResponse> : IRequestHandler<TQuery, ErrorOr<TResponse>>
    where TQuery : IQuery<TResponse>
{
}