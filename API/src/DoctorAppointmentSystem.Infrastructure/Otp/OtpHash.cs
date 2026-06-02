using System.Security.Cryptography;
using System.Text;

namespace DoctorAppointmentSystem.Infrastructure.Otp;

public class OtpHash
{
    public static string Compute(string otp)
    {
        var bytes = Encoding.UTF8.GetBytes(otp);
        var hashBytes = SHA256.HashData(bytes);
        return Convert.ToBase64String(hashBytes);
    }
}