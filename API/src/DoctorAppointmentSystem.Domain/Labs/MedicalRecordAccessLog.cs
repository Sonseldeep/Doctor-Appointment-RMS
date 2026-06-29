using System;
using DoctorAppointmentSystem.Domain.Abstractions;

namespace DoctorAppointmentSystem.Domain.Labs;

public sealed class MedicalRecordAccessLog : Entity
{
    private MedicalRecordAccessLog() { } // Required for EF Core

    public MedicalRecordAccessLog(
        Guid id,
        Guid doctorUserId,
        Guid patientUserId,
        string actionTaken,
        string ipAddress,
        DateTime accessedAtUtc)
    {
        Id = id;
        DoctorUserId = doctorUserId;
        PatientUserId = patientUserId;
        ActionTaken = string.IsNullOrWhiteSpace(actionTaken) ? "VIEWED" : actionTaken;
        IpAddress = string.IsNullOrWhiteSpace(ipAddress) ? "UNKNOWN" : ipAddress;
        AccessedAtUtc = accessedAtUtc;
    }

    public Guid DoctorUserId { get; private set; }
    public Guid PatientUserId { get; private set; }
    public string ActionTaken { get; private set; } = "VIEWED";
    public string IpAddress { get; private set; } = "UNKNOWN";
    public DateTime AccessedAtUtc { get; private set; }
}