//using DoctorAppointmentSystem.Application.Abstractions.Messaging;

//namespace DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;

//public record ReceiveLabPayloadCommand(
//    string LabName,
//    string PatientEmail,
//    string PanelName,
//    DateTime ObservationDate,
//    List<ObservationDto> Observations) : ICommand;

//public record ObservationDto(string TestName, string Value, string Unit, string ReferenceRange, bool IsAbnormal);

using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Labs.ReceiveLabPayload;

// 1. A clean, framework-agnostic wrapper for our file data
public record FileDto(Stream Content, string FileName, string ContentType, long Length);

public record ReceiveLabPayloadCommand(
    string LabName,
    string PatientEmail,
    string PanelName,
    DateTime ObservationDate,
    List<ObservationDto> Observations,
    FileDto? Document = null) : ICommand; // 2. Using our custom DTO instead of IFormFile

public record ObservationDto(string TestName, string Value, string Unit, string ReferenceRange, bool IsAbnormal);