using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;

public record ReceiveLabPayloadCommand(
    string LabName,
    string PatientEmail,
    string PanelName,
    DateTime ObservationDate,
    List<ObservationDto> Observations) : ICommand;

public record ObservationDto(string TestName, string Value, string Unit, string ReferenceRange, bool IsAbnormal);