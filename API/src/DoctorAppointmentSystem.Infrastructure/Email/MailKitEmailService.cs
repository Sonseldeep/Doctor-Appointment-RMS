using DoctorAppointmentSystem.Application.Abstractions.Email;
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
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(toEmail))
                throw new ArgumentException("Recipient email is required", nameof(toEmail));

            var message = new MimeMessage();

            // FROM
            message.From.Add(new MailboxAddress(
                _options.FromName,
                _options.FromEmail.Trim()
            ));

            // TO (❗ THIS WAS YOUR MAIN BUG)
            message.To.Add(new MailboxAddress(
                toName,
                toEmail.Trim()
            ));

            // SUBJECT
            message.Subject = "Verify your email - Doctor Appointment System";

            // BODY
            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = EmailTemplates.OtpVerification(toName, otp)
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // CONNECT (Gmail requires STARTTLS on 587)
            await client.ConnectAsync(
                _options.Host,
                _options.Port,
                SecureSocketOptions.StartTls,
                cancellationToken
            );

            // AUTH
            await client.AuthenticateAsync(
                _options.Username,
                _options.Password,
                cancellationToken
            );

            // SEND
            await client.SendAsync(message, cancellationToken);

            // DISCONNECT
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("OTP email sent successfully to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send OTP email to {Email}", toEmail);
            throw;
        }
    }
}