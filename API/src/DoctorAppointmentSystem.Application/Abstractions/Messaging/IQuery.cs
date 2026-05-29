// using DoctorAppointmentSystem.Domain.Abstractions;
// using MediatR;
//
// namespace DoctorAppointmentSystem.Application.Abstractions.Messaging;
//
// public interface IQuery<TResponse> : IRequest<Result<TResponse>>
// {
// }

using ErrorOr;
using MediatR;

namespace DoctorAppointmentSystem.Application.Abstractions.Messaging;

public interface IQuery<TResponse> : IRequest<ErrorOr<TResponse>>
{
}