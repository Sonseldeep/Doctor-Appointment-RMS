namespace DoctorAppointmentSystem.Infrastructure.Email;

internal static class EmailTemplates
{
    private static string BrandHeader(string bannerColor, string bannerTitle) =>
        $"""
        <div style="background:#ffffff; padding:16px 32px; border-bottom:1px solid #e5e7eb;">
          <span style="font-size:20px; font-weight:700; color:#2563eb;">
          Medi
          <span style="color:#0D5FC4;">
          Link
          </span>
          </span>
          <span
           style="font-size:12px;
            color:#888;
             margin-left:10px;">
             Hospital &amp; Medical Center
             </span>
        </div>
        <div style="background:{bannerColor}; padding:24px 32px; text-align:center;">
          <h1 style="color:#ffffff; margin:0; font-size:20px;">{bannerTitle}</h1>
        </div>
        """;

    private static string Footer => """
        <div style="background:#f4f4f4; padding:16px; text-align:center; font-size:12px; color:#888;">
          © 2026 MediLink Hospital &amp; Medical Center. All rights reserved.
        </div>
        """;

    private static string Wrap(string headerHtml, string bodyHtml) => $"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0;">
          <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            {headerHtml}
            <div style="padding:32px;">
              {bodyHtml}
            </div>
            {Footer}
          </div>
        </body>
        </html>
        """;

    public static string OtpVerification(string name, string otp)
    {
        var body = $"""
            <p>Hello <strong>{name}</strong>,</p>
            <p>Thank you for registering. Please verify your email address using the OTP below:</p>
            <div style="background:#f0f4ff; border:2px dashed #2563eb; border-radius:8px; text-align:center; padding:24px; margin:24px 0;">
              <div style="font-size:40px; font-weight:bold; color:#2563eb; letter-spacing:8px;">{otp}</div>
            </div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you did not create an account, please ignore this email.</p>
            """;

        return Wrap(BrandHeader("#2563eb", "Verify Your Email"), body);
    }

    public static string PasswordResetOtp(string name, string otp)
    {
        var body = $"""
            <p>Hello <strong>{name}</strong>,</p>
            <p>Use the OTP below to reset your password:</p>
            <div style="background:#fff1f2; border:2px dashed #ef4444; border-radius:8px; text-align:center; padding:24px; margin:24px 0;">
              <div style="font-size:40px; font-weight:bold; color:#ef4444; letter-spacing:8px;">{otp}</div>
            </div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            """;

        return Wrap(BrandHeader("#ef4444", "Password Reset Request"), body);
    }

    public static string AppointmentReminder(
        string patientName,
        string doctorName,
        DateTimeOffset appointmentStart,
        string reminderType)
    {
        var timeLabel = reminderType == "24h" ? "tomorrow" : "in 1 hour";
        var bannerColor = reminderType == "24h" ? "#0891b2" : "#d97706";

        var body = $"""
            <p>Dear <strong>{patientName}</strong>,</p>
            <p>This is a reminder that you have an appointment <strong>{timeLabel}</strong>.</p>
            <table style="border-collapse:collapse; width:100%; margin:20px 0;">
              <tr style="background:#f8f9fa;">
                <td style="padding:12px; border:1px solid #dee2e6;"><strong>Doctor</strong></td>
                <td style="padding:12px; border:1px solid #dee2e6;">Dr. {doctorName}</td>
              </tr>
              <tr>
                <td style="padding:12px; border:1px solid #dee2e6;"><strong>Date</strong></td>
                <td style="padding:12px; border:1px solid #dee2e6;">{appointmentStart:dddd, MMMM dd, yyyy}</td>
              </tr>
              <tr style="background:#f8f9fa;">
                <td style="padding:12px; border:1px solid #dee2e6;"><strong>Time</strong></td>
                <td style="padding:12px; border:1px solid #dee2e6;">{appointmentStart:hh:mm tt} UTC</td>
              </tr>
            </table>
            <p style="color:#6c757d; font-size:14px;">
              If you need to cancel, please do so as soon as possible through the app.
            </p>
            """;

        return Wrap(BrandHeader(bannerColor, "Appointment Reminder"), body);
    }

    public static string LabReportReady(
        string patientName,
        string labName,
        string panelName,
        DateTime observationDateTime)
    {
        var body = $"""
            <p>Dear <strong>{patientName}</strong>,</p>
            <p>Your lab report is attached to this email as a PDF for your records.</p>
            <table style="border-collapse:collapse; width:100%; margin:20px 0;">
              <tr style="background:#f8f9fa;">
                <td style="padding:12px; border:1px solid #dee2e6;"><strong>Test Panel</strong></td>
                <td style="padding:12px; border:1px solid #dee2e6;">{panelName}</td>
              </tr>
              <tr>
                <td style="padding:12px; border:1px solid #dee2e6;"><strong>Laboratory</strong></td>
                <td style="padding:12px; border:1px solid #dee2e6;">{labName}</td>
              </tr>
              <tr style="background:#f8f9fa;">
                <td style="padding:12px; border:1px solid #dee2e6;"><strong>Observation Date</strong></td>
                <td style="padding:12px; border:1px solid #dee2e6;">{observationDateTime:yyyy-MM-dd}</td>
              </tr>
            </table>
            <p style="color:#6c757d; font-size:14px;">
              You can also view this report anytime from within the app. If you have any questions about your results, please consult your doctor.
            </p>
            """;

        return Wrap(BrandHeader("#2563eb", "Your Lab Report is Ready"), body);
    }
}