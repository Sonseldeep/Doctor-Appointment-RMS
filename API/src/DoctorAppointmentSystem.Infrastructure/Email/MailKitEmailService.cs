using DoctorAppointmentSystem.Application.Abstractions.Email;
using DoctorAppointmentSystem.Domain.Users;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace DoctorAppointmentSystem.Infrastructure.Email;

public class MailKitEmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly ILogger<MailKitEmailService> _logger;

    public MailKitEmailService(
        IOptions<EmailOptions> options,
        ILogger<MailKitEmailService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task SendOtpEmailAsync(
        string toEmail,
        string toName,
        string otp,
        OtpPurpose purpose,
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                throw new ArgumentException("Recipient email is required", nameof(toEmail));
            }       
            
            var (subject, htmlBody) = purpose switch
            {
                OtpPurpose.EmailVerification => (
                    "Verify your email - DoctorProfile Appointment System",
                    EmailTemplates.OtpVerification(toName, otp)
                ),

                OtpPurpose.PasswordReset => (
                    "Reset your password - DoctorProfile Appointment System",
                    EmailTemplates.PasswordResetOtp(toName, otp)
                ),

                _ => (
                    "Your OTP - DoctorProfile Appointment System",
                    EmailTemplates.OtpVerification(toName, otp)
                )
            };


            var message = new MimeMessage();

            message.From.Add(new MailboxAddress(
                _options.FromName,
                _options.FromEmail.Trim()
            ));

            message.To.Add(new MailboxAddress(
                toName,
                toEmail.Trim()
            ));

            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            await client.ConnectAsync(
                _options.Host,
                _options.Port,
                SecureSocketOptions.StartTls,
                cancellationToken
            );

            await client.AuthenticateAsync(
                _options.Username,
                _options.Password,
                cancellationToken
            );

            await client.SendAsync(message, cancellationToken);

            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("OTP email sent successfully to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send OTP email to {Email}", toEmail);
            throw;
        }
    }
    
    
    public async Task SendAppointmentReminderAsync(
        string toEmail,
        string toName,
        string doctorName,
        DateTimeOffset appointmentStart,
        string reminderType,
        CancellationToken cancellationToken)
    {
        var subject = reminderType == "24h"
            ? "Reminder: Your appointment is tomorrow - Doctor Appointment System"
            : "Reminder: Your appointment is in 1 hour - Doctor Appointment System";

        var htmlBody = EmailTemplates.AppointmentReminder(
            toName, doctorName, appointmentStart, reminderType);

        await SendAsync(toEmail, toName, subject, htmlBody, cancellationToken);
    }
    
    
    private async Task SendAsync(
        string toEmail,
        string toName,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                throw new ArgumentException("Recipient email is required.", nameof(toEmail));
            }
            
            var message = new MimeMessage();
            
            message.From.Add(new MailboxAddress(_options.FromName, _options.FromEmail.Trim()));
            message.To.Add(new MailboxAddress(toName, toEmail.Trim()));
            message.Subject = subject;
            message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

            using var client = new SmtpClient();

            await client.ConnectAsync(
                _options.Host,
                _options.Port,
                SecureSocketOptions.StartTls,
                cancellationToken);

            await client.AuthenticateAsync(
                _options.Username,
                _options.Password,
                cancellationToken);

            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email sent to {Email} — subject: {Subject}", toEmail, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email} — subject: {Subject}", toEmail, subject);
            throw;
        }
    }
}