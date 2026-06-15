using System.Security.Cryptography;
using DoctorAppointmentSystem.Application.Abstractions.Otp;

namespace DoctorAppointmentSystem.Infrastructure.Otp;

public class OtpGenerator : IOtpGenerator
{
    private const int OtpLength = 6;

    public string Generate()
    {
        var max = (int)Math.Pow(10, OtpLength); 
        var randomNumber = RandomNumberGenerator.GetInt32(0, max);
        return randomNumber.ToString($"D{OtpLength}");
        
    }
}