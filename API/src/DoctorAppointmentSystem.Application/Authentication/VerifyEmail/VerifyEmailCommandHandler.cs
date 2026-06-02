using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Otp;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Authentication.VerifyEmail;

public class VerifyEmailCommandHandler : ICommandHandler<VerifyEmailCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IOtpStore _otpStore;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;


    public VerifyEmailCommandHandler(
        IUserRepository userRepository,
        IOtpStore otpStore,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _otpStore = otpStore;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<Success>> Handle(VerifyEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null)
        {
            return OtpErrors.InValid;
        }

        if (user.IsEmailVerified)
        {
            return OtpErrors.AlreadyVerified;
        }

        var utcNow = _dateTimeProvider.UtcNow;
        var isValid = await _otpStore.ValidateAndConsumeAsync(user.Id, request.Otp, utcNow, cancellationToken);

        if (!isValid)
        {
            return OtpErrors.InValid;
        }
        
        user.VerifyEmail();
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }
}