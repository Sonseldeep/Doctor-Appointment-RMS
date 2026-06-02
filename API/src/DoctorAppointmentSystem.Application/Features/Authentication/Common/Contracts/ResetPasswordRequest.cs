namespace DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

public sealed record ResetPasswordRequest(
    string Email, 
    string Otp, 
    string NewPassword);