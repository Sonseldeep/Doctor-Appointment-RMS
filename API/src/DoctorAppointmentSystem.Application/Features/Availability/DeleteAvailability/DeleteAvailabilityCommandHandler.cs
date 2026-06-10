using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Availability;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Availability.DeleteAvailability;

internal sealed class DeleteAvailabilityCommandHandler : ICommandHandler<DeleteAvailabilityCommand>
{
    private readonly IDoctorAvailabilityRepository _availability;
    private readonly IUnitOfWork _uow;

    public DeleteAvailabilityCommandHandler(
        IDoctorAvailabilityRepository availability,
        IUnitOfWork uow)
    {
        _availability = availability;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(
        DeleteAvailabilityCommand request,
        CancellationToken cancellationToken)
    {
        var availability = await _availability.GetByIdWithSlotsAsync(
            request.AvailabilityId, cancellationToken);

        if (availability is null || availability.DoctorUserId != request.DoctorUserId)
        {
            return AvailabilityErrors.NotFound;
        }

        if (availability.Date < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return AvailabilityErrors.CannotModifyPast;
        }

        var guard = availability.EnsureCanDelete();
        if (guard.IsError)
        {
            return guard.Errors;
        }

        _availability.Remove(availability);
        await _uow.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }
}
