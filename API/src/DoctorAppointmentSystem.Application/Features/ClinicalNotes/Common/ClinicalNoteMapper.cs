using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Domain.ClinicalNotes;
using DoctorAppointmentSystem.Domain.Users;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.Common;

internal static class ClinicalNoteMapper
{
    public static ClinicalNoteResponse ToResponse(
        ClinicalNote note,
        DateTimeOffset appointmentDate,
        User doctor,
        User patient)
        => new(
            Id: note.Id,
            AppointmentId: note.AppointmentId,
            DoctorUserId: note.DoctorUserId,
            PatientUserId: note.PatientUserId,
            DoctorName: $"Dr. {doctor.FirstName} {doctor.LastName}",
            DoctorPhotoUrl: doctor.ProfilePhotoUrl,
            PatientName: $"{patient.FirstName} {patient.LastName}",
            PatientPhotoUrl: patient.ProfilePhotoUrl,
            AppointmentDate: appointmentDate,
            Diagnosis: note.Diagnosis,
            Observations: note.Observations,
            TreatmentSummary: note.TreatmentSummary,
            FollowUpDate: note.FollowUpDate,
            FollowUpInstructions: note.FollowUpInstructions,
            CreatedAtUtc: note.CreatedAtUtc,
            UpdatedAtUtc: note.UpdatedAtUtc,
            Medications: note.Medications.Select(ToResponse).ToList());

    public static ClinicalNoteResponse ToResponse(ClinicalNoteWithDetailsDto dto)
        => new(
            Id: dto.Id,
            AppointmentId: dto.AppointmentId,
            DoctorUserId: dto.DoctorUserId,
            PatientUserId: dto.PatientUserId,
            DoctorName: $"Dr. {dto.DoctorFirstName} {dto.DoctorLastName}",
            DoctorPhotoUrl: dto.DoctorPhotoUrl,
            PatientName: $"{dto.PatientFirstName} {dto.PatientLastName}",
            PatientPhotoUrl: dto.PatientPhotoUrl,
            AppointmentDate: dto.AppointmentStartUtc,
            Diagnosis: dto.Diagnosis,
            Observations: dto.Observations,
            TreatmentSummary: dto.TreatmentSummary,
            FollowUpDate: dto.FollowUpDate,
            FollowUpInstructions: dto.FollowUpInstructions,
            CreatedAtUtc: dto.CreatedAtUtc,
            UpdatedAtUtc: dto.UpdatedAtUtc,
            Medications: dto.Medications.Select(ToResponse).ToList());

    public static MedicationResponse ToResponse(Medication medication)
        => new(
            Id: medication.Id,
            Name: medication.Name,
            Dosage: medication.Dosage,
            Frequency: medication.Frequency,
            DurationInDays: medication.DurationInDays,
            Instructions: medication.Instructions);
}
