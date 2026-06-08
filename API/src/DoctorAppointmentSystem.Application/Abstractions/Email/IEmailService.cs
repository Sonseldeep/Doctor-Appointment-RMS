using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Application.Abstractions.Email;

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string toName, string otp,OtpPurpose purpose, CancellationToken cancellationToken);
    
    Task SendAppointmentReminderAsync(
        string toEmail,
        string toName,
        string doctorName,
        DateTimeOffset appointmentStart,
        string reminderType, 
        CancellationToken cancellationToken);
}