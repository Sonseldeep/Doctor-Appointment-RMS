using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Doctors;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Doctors.UpdateDoctorProfile;

internal sealed class UpdateDoctorProfileCommandHandler
    : ICommandHandler<UpdateDoctorProfileCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IDoctorProfileRepository _doctorProfileRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateDoctorProfileCommandHandler(
        IUserRepository userRepository,
        IDoctorProfileRepository doctorProfileRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _doctorProfileRepository = doctorProfileRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateDoctorProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null) return UserErrors.NotFound;

        if (user.Role != UserRole.Doctor)
            return DoctorErrors.UserIsNotDoctor;

        var profile = await _doctorProfileRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (profile is null) return DoctorErrors.NotFound;

        profile.Update(request.Bio, request.Specialization, request.ConsultationFee);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success;
    }
}