using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;

public record FileDto(Stream Content, string FileName, string ContentType, long Length);

public record ReceiveLabPayloadCommand(
    string LabName,
    string PatientEmail,
    string PanelName,
    DateTime ObservationDate,
    List<ObservationDto> Observations,
    FileDto? Document = null) : ICommand; 

public record ObservationDto(string TestName, string Value, string Unit, string ReferenceRange, bool IsAbnormal);