namespace DoctorAppointmentSystem.Application.Features.Authentication.Common.Contracts;

public sealed record ChangePasswordRequest(string CurrentPassword, string NewPassword);