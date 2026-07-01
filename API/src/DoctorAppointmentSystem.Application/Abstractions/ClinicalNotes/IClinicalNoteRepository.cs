using DoctorAppointmentSystem.Application.Features.ClinicalNotes.Contracts;
using DoctorAppointmentSystem.Domain.ClinicalNotes;

namespace DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;

public interface IClinicalNoteRepository
{
    Task<ClinicalNote?> GetByIdAsync(Guid clinicalNoteId, CancellationToken cancellationToken);

    Task<ClinicalNote?> GetByAppointmentIdAsync(Guid appointmentId, CancellationToken cancellationToken);

    Task<bool> ExistsForAppointmentAsync(Guid appointmentId, CancellationToken cancellationToken);

    Task AddAsync(ClinicalNote clinicalNote, CancellationToken cancellationToken);


    Task<IReadOnlyList<ClinicalNoteWithDetailsDto>> GetForPatientAsync(Guid patientUserId, CancellationToken cancellationToken);

    Task<IReadOnlyList<ClinicalNoteWithDetailsDto>> GetForDoctorAsync(Guid doctorUserId, CancellationToken cancellationToken);
    
    Task UpdateWithMedicationsAsync(ClinicalNote note, List<MedicationRequest> medications, CancellationToken cancellationToken);

    Task<IReadOnlyList<ClinicalNoteWithDetailsDto>> GetUpcomingFollowUpsAsync(Guid patientUserId, DateTimeOffset now, CancellationToken cancellationToken);

    Task<ClinicalNoteWithDetailsDto?> GetWithDetailsByAppointmentIdAsync(Guid appointmentId, CancellationToken cancellationToken);
}