using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Availability;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Availability;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Common;


public static class FollowUpSlotBooking
{
    public static async Task<ErrorOr<Appointment>> ReserveAsync(
        IDoctorAvailabilityRepository availabilityRepository,
        IAppointmentRepository appointmentRepository,
        Guid doctorUserId,
        Guid patientUserId,
        Guid slotId,
        DateTimeOffset utcNow,
        string? notes,
        CancellationToken cancellationToken)
    {
        var slot = await availabilityRepository.GetSlotWithAvailabilityAsync(slotId, cancellationToken);
        if (slot is null)
        {
            return AvailabilityErrors.SlotNotFound;
        }

        if (slot.Availability.DoctorUserId != doctorUserId)
        {
            return AvailabilityErrors.SlotBelongsToDifferentDoctor;
        }

        var date = slot.Availability.Date;
        var startUtc = new DateTimeOffset(
            date.Year, date.Month, date.Day,
            slot.StartTime.Hour, slot.StartTime.Minute, 0,
            TimeSpan.Zero);

        var endUtc = new DateTimeOffset(
            date.Year, date.Month, date.Day,
            slot.EndTime.Hour, slot.EndTime.Minute, 0,
            TimeSpan.Zero);

        if (startUtc <= utcNow)
        {
            return AppointmentErrors.CannotBookInPast;
        }

        var doctorOverlap = await appointmentRepository.DoctorHasOverlapAsync(
            doctorUserId, startUtc, endUtc, cancellationToken);
        
        if (doctorOverlap)
        {
            return AppointmentErrors.SlotNotAvailable;
        }

        var patientOverlap = await appointmentRepository.PatientHasOverlapAsync(
            patientUserId, startUtc, endUtc, cancellationToken);
        
        if (patientOverlap)
        {
            return AppointmentErrors.PatientSlotConflict;
        }

        var appointment = Appointment.Create(patientUserId, doctorUserId, startUtc, endUtc, notes);

        var bookResult = slot.Book(appointment.Id);
        if (bookResult.IsError)
        {
            return bookResult.Errors;
        }

        await appointmentRepository.AddAsync(appointment, cancellationToken);

        return appointment;
    }
}
