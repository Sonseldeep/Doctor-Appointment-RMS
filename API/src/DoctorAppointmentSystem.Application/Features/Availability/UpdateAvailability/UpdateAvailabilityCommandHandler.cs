using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Availability;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Availability.UpdateAvailability;

internal sealed class UpdateAvailabilityCommandHandler : ICommandHandler<UpdateAvailabilityCommand>
{
    private readonly IDoctorAvailabilityRepository _availability;
    private readonly IUnitOfWork _uow;

    public UpdateAvailabilityCommandHandler(
        IDoctorAvailabilityRepository availability,
        IUnitOfWork uow)
    {
        _availability = availability;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(
        UpdateAvailabilityCommand request,
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

        if (availability.Slots.Any(s => s.IsBooked))
        {
            return AvailabilityErrors.CannotUpdateWithBookedSlots;
        }

        var validation = DoctorAvailability.ValidateWindow(
            request.StartTime, request.EndTime, request.SlotDurationMinutes);
        if (validation.IsError)
        {
            return validation.Errors;
        }

        await _availability.ReplaceAvailabilityAsync(
            request.AvailabilityId,
            request.StartTime,
            request.EndTime,
            request.SlotDurationMinutes,
            cancellationToken);

        return Result.Success;
    }
}