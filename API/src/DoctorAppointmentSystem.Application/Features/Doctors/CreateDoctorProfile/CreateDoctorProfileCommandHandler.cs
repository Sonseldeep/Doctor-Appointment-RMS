using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.CreateDoctorProfile;

internal sealed class CreateDoctorProfileCommandHandler
    : ICommandHandler<CreateDoctorProfileCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IDoctorProfileRepository _doctorProfileRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateDoctorProfileCommandHandler(
        IUserRepository userRepository,
        IDoctorProfileRepository doctorProfileRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _doctorProfileRepository = doctorProfileRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<Guid>> Handle(CreateDoctorProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            return UserErrors.NotFound;
        }

        if (user.Role != UserRole.Doctor)
        {
            return DoctorErrors.UserIsNotDoctor;
        }

        var existing = await _doctorProfileRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (existing is not null)
        {
            return DoctorErrors.AlreadyExists;
        }
        
        
        var nmcTaken = await _doctorProfileRepository.NmcNumberExistsAsync(
            request.NmcNumber, cancellationToken);
        
        if (nmcTaken)
        {
            return DoctorErrors.NmcNumberAlreadyRegistered;
        }

        var profile = DoctorProfile.Create(
            userId: request.UserId,
            nmcNumber:request.NmcNumber,
            bio: request.Bio,
            specialization: request.Specialization,
            consultationFee: request.ConsultationFee);

        await _doctorProfileRepository.AddAsync(profile, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return profile.Id;
    }
}