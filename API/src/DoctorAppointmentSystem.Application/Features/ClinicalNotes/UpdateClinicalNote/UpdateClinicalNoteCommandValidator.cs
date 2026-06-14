using DoctorAppointmentSystem.Application.Features.ClinicalNotes.AddClinicalNote;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.UpdateClinicalNote;

internal sealed class UpdateClinicalNoteCommandValidator : AbstractValidator<UpdateClinicalNoteCommand>
{
    public UpdateClinicalNoteCommandValidator()
    {
        RuleFor(x => x.ClinicalNoteId)
            .NotEmpty()
            .WithMessage("Clinical note ID is required.");

        RuleFor(x => x.Diagnosis)
            .NotEmpty()
            .WithMessage("Diagnosis is required.")
            .MaximumLength(1000)
            .WithMessage("Diagnosis cannot exceed 1000 characters.");

        RuleFor(x => x.Observations)
            .MaximumLength(2000)
            .WithMessage("Observations cannot exceed 2000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Observations));

        RuleFor(x => x.TreatmentSummary)
            .MaximumLength(2000)
            .WithMessage("Treatment summary cannot exceed 2000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.TreatmentSummary));

        RuleFor(x => x.FollowUpInstructions)
            .MaximumLength(1000)
            .WithMessage("Follow-up instructions cannot exceed 1000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.FollowUpInstructions));

        RuleForEach(x => x.Medications).SetValidator(new MedicationRequestValidator())
            .When(x => x.Medications is not null);
    }
}