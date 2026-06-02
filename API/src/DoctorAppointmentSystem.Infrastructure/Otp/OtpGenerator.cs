using System.Security.Cryptography;
using DoctorAppointmentSystem.Application.Abstractions.Otp;

namespace DoctorAppointmentSystem.Infrastructure.Otp;

public class OtpGenerator : IOtpGenerator
{
    private const int OtpLength = 6;

    public string Generate()
    {
        var randomNumber = RandomNumberGenerator.GetInt32(0, 1_000_000);
        return randomNumber.ToString("D6");
        
    }
}