using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Email;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Otp;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Authentication.ResendOtp;

public sealed class ResendOtpCommandHandler : ICommandHandler<ResendOtpCommand>
{
    private static readonly TimeSpan OtpLifetime = TimeSpan.FromMinutes(10);

    private readonly IUserRepository _userRepository;
    private readonly IOtpGenerator _otpGenerator;
    private readonly IOtpStore _otpStore;
    private readonly IOtpRequestLimiter _otpRequestLimiter;
    private readonly IEmailService _emailService;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public ResendOtpCommandHandler(
        IUserRepository userRepository,
        IOtpGenerator otpGenerator,
        IOtpStore otpStore,
        IOtpRequestLimiter otpRequestLimiter,
        IEmailService emailService,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _otpGenerator = otpGenerator;
        _otpStore = otpStore;
        _otpRequestLimiter = otpRequestLimiter;
        _emailService = emailService;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<Success>> Handle(ResendOtpCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

       
        if (user is null || user.IsEmailVerified)
        {
            return Result.Success;
        }

        var utcNow = _dateTimeProvider.UtcNow;

        var limitResult = await _otpRequestLimiter.CheckAndIncrementAsync(
            user.Email,
            OtpPurpose.EmailVerification,
            utcNow,
            cancellationToken);

        if (limitResult.IsError)
        {
            return limitResult.Errors;
        }

        var otp = _otpGenerator.Generate();
        var expiresAt = utcNow.Add(OtpLifetime);

        await _otpStore.StoreAsync(user.Id, OtpPurpose.EmailVerification, otp, expiresAt, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _emailService.SendOtpEmailAsync(user.Email, $"{user.FirstName} {user.LastName}", otp, OtpPurpose.EmailVerification, cancellationToken);

        return Result.Success;
    }
}