using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Jobs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Application.Features.Appointments.Contracts;
using DoctorAppointmentSystem.Application.Features.Doctors.Common;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Appointments.BookAppointment;

internal sealed class BookAppointmentCommandHandler
    : ICommandHandler<BookAppointmentCommand, BookAppointmentResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDoctorProfileRepository _doctorProfiles;
    private readonly IPatientProfileRepository _patientRepository;
    private readonly IAppointmentScheduler _scheduler;

    
    private const int MaxAppointmentsPerDay = 10;



    public BookAppointmentCommandHandler(
        IUserRepository userRepository,
        IAppointmentRepository appointmentRepository,
        IUnitOfWork unitOfWork,
        IDoctorProfileRepository doctorProfiles,
        IPatientProfileRepository patientRepository,
        IAppointmentScheduler scheduler)
    {
        _userRepository = userRepository;
        _appointmentRepository = appointmentRepository;
        _unitOfWork = unitOfWork;
        _doctorProfiles = doctorProfiles;
        _patientRepository = patientRepository;
        _scheduler = scheduler;
    }
    



    public async Task<ErrorOr<BookAppointmentResponse>> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
    {
        if (request.EndUtc <= request.StartUtc)
        {
            return AppointmentErrors.InvalidDuration;
        }
        
        if (request.StartUtc < DateTime.UtcNow)
        {
            return AppointmentErrors.CannotBookInPast;
        }
          

        var patient = await _userRepository.GetByIdAsync(request.PatientUserId, cancellationToken);
        if (patient is null)
        {
            return UserErrors.NotFound;
        }

        if (patient.Role != UserRole.Registered)
        {
            return AppointmentErrors.Forbidden;
        }
        
        if (!patient.IsEmailVerified)
        {
            return UserErrors.NotVerified;
        }

            

        var doctorUser = await _userRepository.GetByIdAsync(request.DoctorUserId, cancellationToken);
        if (doctorUser is null)
        {
            return UserErrors.NotFound;
        }
        
        var doctorProfile = await _doctorProfiles.GetByUserIdAsync(request.DoctorUserId, cancellationToken);
        
        var access = DoctorAccessGuards.EnsureApprovedForPublicView(doctorUser, doctorProfile);
        if (access.IsError)
        {
            return access.Errors;
        }
        
        var overlap = await _appointmentRepository.DoctorHasOverlapAsync(
            request.DoctorUserId, request.StartUtc, request.EndUtc, cancellationToken);

        if (overlap)
        {
            return AppointmentErrors.SlotNotAvailable;
        }
        
        var appointmentDate = request.StartUtc.Date;
        var dailyAppointmentCount = await _appointmentRepository.GetDoctorAppointmentCountForDateAsync(
            request.DoctorUserId,
            appointmentDate,
            cancellationToken);
        
        if (dailyAppointmentCount >= MaxAppointmentsPerDay)
        {
            return AppointmentErrors.DailyQuotaExceeded(MaxAppointmentsPerDay);
        }


        
        var appointment = Appointment.Create(
            request.PatientUserId,
            request.DoctorUserId,
            request.StartUtc,
            request.EndUtc,
            request.Notes);

        await _appointmentRepository.AddAsync(appointment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        // schedule remainders after successful in DB save
        _scheduler.ScheduleReminders(appointment.Id, appointment.StartUtc);
        
        var remainingSlots = MaxAppointmentsPerDay - (dailyAppointmentCount + 1);
        var response = new BookAppointmentResponse(
            AppointmentId: appointment.Id,
            Status: appointment.Status.ToString(),
            Message: $"Appointment booked successfully! " +
                     $"{remainingSlots} slots remaining for {appointmentDate:dd-MM-yyyy}");


        return response;
    }
}