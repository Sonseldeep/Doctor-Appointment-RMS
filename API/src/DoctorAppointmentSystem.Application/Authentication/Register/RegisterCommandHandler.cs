using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Authentication.Contracts;
using DoctorAppointmentSystem.Domain.Users;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Authentication.Register;

public class RegisterCommandHandler : 
    ICommandHandler<RegisterCommand, AuthResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterCommandHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<ErrorOr<AuthResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
       var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
       if (existingUser is not null)
       {
           return AuthErrors.EmailAlreadyExists;
       }
       
       var passwordHash = _passwordHasher.Hash(request.Password);

       var role = ParseRole(request.Role);
       
       var user = User.Create(
           request.FirstName,
           request.LastName,
           request.Email, passwordHash,
           role);
       
       await _userRepository.AddAsync(user, cancellationToken);
       await _unitOfWork.SaveChangesAsync(cancellationToken);

       var claims = AuthClaims.Create(user);

       var accessToken = _jwtTokenGenerator.GenerateAccessToken(claims);
       var response = new AuthResponse(accessToken);
       return response;
    }
    
    private static UserRole ParseRole(string role)
    {
        if (string.Equals(role, nameof(UserRole.Admin), StringComparison.OrdinalIgnoreCase))
        {
            return UserRole.Admin;
        }

        return string.Equals(role, nameof(UserRole.Doctor), StringComparison.OrdinalIgnoreCase)
            ? UserRole.Doctor 
            : UserRole.Registered;
    }
    
    
}