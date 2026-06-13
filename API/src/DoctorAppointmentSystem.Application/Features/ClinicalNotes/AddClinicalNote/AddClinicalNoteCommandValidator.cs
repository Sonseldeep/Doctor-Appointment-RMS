using FluentValidation;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.AddClinicalNote;

internal sealed class AddClinicalNoteCommandValidator : AbstractValidator<AddClinicalNoteCommand>
{
    public AddClinicalNoteCommandValidator()
    {
        RuleFor(x => x.AppointmentId)
            .NotEmpty()
            .WithMessage("Appointment ID is required.");

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

internal sealed class MedicationRequestValidator : AbstractValidator<Contracts.MedicationRequest>
{
    public MedicationRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Medicine name is required.")
            .MaximumLength(200)
            .WithMessage("Medicine name cannot exceed 200 characters.");

        RuleFor(x => x.Dosage)
            .NotEmpty()
            .WithMessage("Dosage is required.")
            .MaximumLength(100)
            .WithMessage("Dosage cannot exceed 100 characters.");

        RuleFor(x => x.Frequency)
            .NotEmpty()
            .WithMessage("Frequency is required.")
            .MaximumLength(100)
            .WithMessage("Frequency cannot exceed 100 characters.");

        RuleFor(x => x.DurationInDays)
            .GreaterThan(0)
            .WithMessage("Duration must be a positive number of days.")
            .When(x => x.DurationInDays.HasValue);

        RuleFor(x => x.Instructions)
            .MaximumLength(500)
            .WithMessage("Instructions cannot exceed 500 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Instructions));
    }
}
