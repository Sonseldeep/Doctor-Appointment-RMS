namespace DoctorAppointmentSystem.Infrastructure.Email;

internal static class EmailTemplates
{
    public static string OtpVerification(string name, string otp)
    {
        return $"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                </head>

                <body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0;">

                    <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

                        <!-- Header -->
                        <div style="background:#2563eb; padding:32px; text-align:center;">
                            <h1 style="color:#ffffff; margin:0; font-size:24px;">
                                Doctor Appointment System
                            </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding:32px;">
                            <p>Hello <strong>{name}</strong>,</p>

                            <p>
                                Thank you for registering. Please verify your email address using the OTP below:
                            </p>

                            <div style="background:#f0f4ff; border:2px dashed #2563eb; border-radius:8px; text-align:center; padding:24px; margin:24px 0;">
                                <div style="font-size:40px; font-weight:bold; color:#2563eb; letter-spacing:8px;">
                                    {otp}
                                </div>
                            </div>

                            <p>This OTP is valid for <strong>10 minutes</strong>.</p>

                            <p>If you did not create an account, please ignore this email.</p>
                        </div>

                        <!-- Footer -->
                        <div style="background:#f4f4f4; padding:16px; text-align:center; font-size:12px; color:#888;">
                            © 2026 Doctor Appointment System. All rights reserved.
                        </div>

                    </div>

                </body>
                </html>
                """;
    }
    
    
    public static string PasswordResetOtp(string name, string otp)
    {
        return $"""
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0;">
                  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <div style="background:#ef4444; padding:32px; text-align:center;">
                      <h1 style="color:#ffffff; margin:0; font-size:24px;">Doctor Appointment System</h1>
                    </div>
                    <div style="padding:32px;">
                      <p>Hello <strong>{name}</strong>,</p>
                      <p>Use the OTP below to reset your password:</p>
                      <div style="background:#fff1f2; border:2px dashed #ef4444; border-radius:8px; text-align:center; padding:24px; margin:24px 0;">
                        <div style="font-size:40px; font-weight:bold; color:#ef4444; letter-spacing:8px;">{otp}</div>
                      </div>
                      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                      <p>If you did not request a password reset, please ignore this email.</p>
                    </div>
                    <div style="background:#f4f4f4; padding:16px; text-align:center; font-size:12px; color:#888;">
                      © 2026 Doctor Appointment System. All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
                """;
    }
}