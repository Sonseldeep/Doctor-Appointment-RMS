using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.ExportClinicalNotes;

public record ExportClinicalNotesQuery(Guid AppointmentId) : IQuery<byte[]>;