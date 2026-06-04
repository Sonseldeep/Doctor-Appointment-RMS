using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;

internal sealed class BookAppointmentCommandHandler
    : ICommandHandler<BookAppointmentCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public BookAppointmentCommandHandler(
        IUserRepository userRepository,
        IAppointmentRepository appointmentRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _appointmentRepository = appointmentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<Guid>> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
    {
        if (request.EndUtc <= request.StartUtc)
            return AppointmentErrors.InvalidTime;

        var patient = await _userRepository.GetByIdAsync(request.PatientUserId, cancellationToken);
        if (patient is null) return UserErrors.NotFound;
        if (patient.Role != UserRole.Registered)
            return AppointmentErrors.Forbidden;

        var doctorUser = await _userRepository.GetByIdAsync(request.DoctorUserId, cancellationToken);
        if (doctorUser is null) return UserErrors.NotFound;
        if (doctorUser.Role != UserRole.Doctor)
            return Error.Validation("Appointment.DoctorInvalid", "Selected user is not a doctor.");

        var overlap = await _appointmentRepository.DoctorHasOverlapAsync(
            request.DoctorUserId, request.StartUtc, request.EndUtc, cancellationToken);

        if (overlap)
            return AppointmentErrors.SlotNotAvailable;

        var appointment = Appointment.Create(
            request.PatientUserId,
            request.DoctorUserId,
            request.StartUtc,
            request.EndUtc,
            request.Notes);

        await _appointmentRepository.AddAsync(appointment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return appointment.Id;
    }
}