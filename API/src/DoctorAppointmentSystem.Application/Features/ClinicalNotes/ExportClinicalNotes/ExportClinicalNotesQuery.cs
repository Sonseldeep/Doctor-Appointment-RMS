using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.ExportClinicalNotes;

// CHANGED: Query now takes the specific appointmentId instead of a broad patientId
public record ExportClinicalNotesQuery(Guid AppointmentId) : IQuery<byte[]>;