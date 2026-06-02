namespace DoctorAppointmentSystem.Application.Abstractions.Email;

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string toName, string otp, CancellationToken cancellationToken);
}