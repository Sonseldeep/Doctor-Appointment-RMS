using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Data;
using DoctorAppointmentSystem.Application.Abstractions.Email;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Otp;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using DoctorAppointmentSystem.Application.Features.Authentication.Common;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Authentication.Register;

public class RegisterCommandHandler : 
    ICommandHandler<RegisterCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;
    
    private readonly IOtpGenerator _otpGenerator;
    private readonly IOtpStore _otpStore;
    private readonly IEmailService _emailService;
    private readonly IDateTimeProvider _dateTimeProvider;
    
    private static readonly TimeSpan OtpLifetime = TimeSpan.FromMinutes(10);
    private readonly IPatientProfileRepository _patientProfiles;



    public RegisterCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher, 
        IUnitOfWork unitOfWork,
        IOtpGenerator otpGenerator,
        IEmailService emailService,
        IDateTimeProvider dateTimeProvider,
        IOtpStore otpStore,
        IPatientProfileRepository patientProfiles)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
        _otpGenerator = otpGenerator;
        _emailService = emailService;
        _dateTimeProvider = dateTimeProvider;
        _otpStore = otpStore;
        _patientProfiles = patientProfiles;
    }

    public async Task<ErrorOr<Success>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        //  1.Check email already exists
       var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
       
       if (existingUser is not null)
       {
           return AuthErrors.EmailAlreadyExists;
       }
       
       // 2. Create user 
       var passwordHash = _passwordHasher.Hash(request.Password);

       var roleResult = ParseRole(request.Role);
       
       if (roleResult.IsError)
       {
           return roleResult.Errors;
       }
       
       var user = User.Create(
           request.FirstName,
           request.LastName,
           request.Email,
           passwordHash,
           roleResult.Value,
           _dateTimeProvider.UtcNow);
       
       await _userRepository.AddAsync(user, cancellationToken);
       await _unitOfWork.SaveChangesAsync(cancellationToken);
       
       
       if (roleResult.Value == UserRole.Registered)
       {
           var profile = PatientProfile.Create(user.Id);
           await _patientProfiles.AddAsync(profile, cancellationToken);
           await _unitOfWork.SaveChangesAsync(cancellationToken);
       }

       // 3. Generate and store OTP
       var otp = _otpGenerator.Generate();
       var expiresAt = _dateTimeProvider.UtcNow.Add(OtpLifetime);
       
       await _otpStore.StoreAsync(user.Id, OtpPurpose.EmailVerification, otp, expiresAt, cancellationToken);
       await _unitOfWork.SaveChangesAsync(cancellationToken);
       
       // 4. Send OTP email
       await _emailService.SendOtpEmailAsync(
           user.Email, 
           $"{user.FirstName} {user.LastName}",
           otp,
           OtpPurpose.EmailVerification,
           cancellationToken);

       
       return Result.Success;


    }
    
    private static ErrorOr<UserRole> ParseRole(string role)
    {
        if (Enum.TryParse<UserRole>(role?.Trim(), ignoreCase: true, out var parsed))
        {
            return parsed;
        }

        return Error.Validation("Role", "Role must be Registered, Doctor, LabTechnician or Admin.");
    }
    
    
}