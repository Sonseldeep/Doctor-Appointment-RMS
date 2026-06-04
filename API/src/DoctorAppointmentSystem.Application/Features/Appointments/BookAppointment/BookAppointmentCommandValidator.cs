using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;

internal sealed class BookAppointmentCommandValidator
    : AbstractValidator<BookAppointmentCommand>
{
    public BookAppointmentCommandValidator()
    {
        RuleFor(x => x.PatientUserId).NotEmpty();
        RuleFor(x => x.DoctorUserId).NotEmpty();
        RuleFor(x => x.StartUtc).NotEmpty();
        RuleFor(x => x.EndUtc).NotEmpty();
    }
}