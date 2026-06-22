//using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
//using DoctorAppointmentSystem.Application.Abstractions.Messaging;
//using ErrorOr;
//using QuestPDF.Fluent;
//using QuestPDF.Helpers;

//namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.ExportClinicalNotes;

//public class ExportClinicalNotesQueryHandler : IQueryHandler<ExportClinicalNotesQuery, byte[]>
//{
//    private readonly IClinicalNoteRepository _repository;

//    public ExportClinicalNotesQueryHandler(IClinicalNoteRepository repository) => _repository = repository;

//    public async Task<ErrorOr<byte[]>> Handle(ExportClinicalNotesQuery request, CancellationToken cancellationToken)
//    {
//        // 1. Fetch the single specific note for this appointment
//        var note = await _repository.GetWithDetailsByAppointmentIdAsync(request.AppointmentId, cancellationToken);

//        if (note == null)
//        {
//            return Error.NotFound(description: "No medical prescription or note found for this appointment.");
//        }

//        // 2. Build the individual receipt/prescription document layout
//        var document = Document.Create(container =>
//        {
//            container.Page(page =>
//            {
//                page.Margin(30);

//                // Header section
//                page.Header().Column(col =>
//                {
//                    col.Item().Text("MEDICAL PRESCRIPTION").FontSize(24).Bold().FontColor(Colors.Blue.Medium);
//                    col.Item().Text($"Date: {note.CreatedAtUtc:yyyy-MM-dd}").FontSize(10).FontColor(Colors.Grey.Darken2);

//                    col.Item().PaddingTop(10).Row(row =>
//                    {
//                        row.RelativeItem().Column(c =>
//                        {
//                            c.Item().Text("Patient:").FontSize(10).Bold();
//                            c.Item().Text($"{note.PatientFirstName} {note.PatientLastName}").FontSize(12);
//                        });
//                        row.RelativeItem().Column(c =>
//                        {
//                            c.Item().Text("Doctor:").FontSize(10).Bold();
//                            c.Item().Text($"Dr. {note.DoctorFirstName} {note.DoctorLastName}").FontSize(12);
//                        });
//                    });

//                    col.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
//                });

//                // Body content section
//                page.Content().PaddingVertical(15).Column(col =>
//                {
//                    // Diagnosis details
//                    col.Item().Text("Diagnosis:").Bold().FontSize(14);
//                    col.Item().PaddingBottom(10).Text(note.Diagnosis).FontSize(12);

//                    if (!string.IsNullOrWhiteSpace(note.Observations))
//                    {
//                        col.Item().Text("Observations:").Bold().FontSize(12);
//                        col.Item().PaddingBottom(10).Text(note.Observations).FontSize(11).Italic();
//                    }

//                    col.Item().PaddingVertical(5).LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);

//                    // Medications Table
//                    col.Item().PaddingTop(10).Text("Prescribed Medications:").Bold().FontSize(14);
//                    col.Item().PaddingVertical(10).Table(table =>
//                    {
//                        table.ColumnsDefinition(c =>
//                        {
//                            c.RelativeColumn(3); // Name
//                            c.RelativeColumn(2); // Dosage
//                            c.RelativeColumn(2); // Frequency
//                            c.RelativeColumn(2); // Duration
//                        });

//                        // Table Header
//                        table.Header(h =>
//                        {
//                            h.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Medication").Bold();
//                            h.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Dosage").Bold();
//                            h.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Frequency").Bold();
//                            h.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Duration").Bold();
//                        });

//                        // Table Rows
//                        foreach (var med in note.Medications)
//                        {
//                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(med.Name);
//                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(med.Dosage);
//                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(med.Frequency);
//                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{med.DurationInDays} Days");
//                        }
//                    });

//                    // Follow up instructions
//                    if (!string.IsNullOrWhiteSpace(note.FollowUpInstructions))
//                    {
//                        col.Item().PaddingTop(15).Text("Instructions & Follow up:").Bold().FontSize(12);
//                        col.Item().Text(note.FollowUpInstructions).FontSize(11);
//                    }
//                });

//                // Footer section
//                page.Footer().AlignCenter().Text(t =>
//                {
//                    t.Span("Page ").FontSize(9);
//                    t.CurrentPageNumber().FontSize(9);
//                });
//            });
//        });

//        return document.GeneratePdf();
//    }
//}

using DoctorAppointmentSystem.Application.Abstractions.ClinicalNotes;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using ErrorOr;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace DoctorAppointmentSystem.Application.Features.ClinicalNotes.ExportClinicalNotes;

public class ExportClinicalNotesQueryHandler : IQueryHandler<ExportClinicalNotesQuery, byte[]>
{
    private readonly IClinicalNoteRepository _repository;

    public ExportClinicalNotesQueryHandler(IClinicalNoteRepository repository) => _repository = repository;

    public async Task<ErrorOr<byte[]>> Handle(ExportClinicalNotesQuery request, CancellationToken cancellationToken)
    {
        // 1. Fetch the note using the "WithDetails" method
        var note = await _repository.GetWithDetailsByAppointmentIdAsync(request.AppointmentId, cancellationToken);

        if (note == null)
        {
            return Error.NotFound(description: "No medical prescription or note found for this appointment.");
        }

        // 2. Build the professional layout
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                // --- HEADER ---
                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("MEDILINK").FontSize(28).SemiBold().FontColor(Colors.Blue.Medium);
                        col.Item().Text("Hospital & Medical Center").FontSize(10).FontColor(Colors.Grey.Darken1);
                    });

                    row.RelativeItem().AlignRight().Column(col =>
                    {
                        col.Item().Text("PRESCRIPTION").FontSize(20).Bold().FontColor(Colors.Grey.Darken3);
                        col.Item().Text($"Date: {note.CreatedAtUtc:yyyy-MM-dd}").FontSize(10);
                    });
                });

                // --- CONTENT ---
                page.Content().PaddingVertical(20).Column(col =>
                {
                    // Patient & Doctor Info Box
                    col.Item().Background(Colors.Grey.Lighten4).Padding(10).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("PATIENT").FontSize(9).SemiBold().FontColor(Colors.Blue.Medium);
                            c.Item().Text($"{note.PatientFirstName} {note.PatientLastName}").FontSize(12).Bold();
                        });
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("ATTENDING DOCTOR").FontSize(9).SemiBold().FontColor(Colors.Blue.Medium);
                            c.Item().Text($"Dr. {note.DoctorFirstName} {note.DoctorLastName}").FontSize(12).Bold();
                        });
                    });

                    col.Item().PaddingTop(20).Text("Clinical Diagnosis").FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);
                    col.Item().PaddingBottom(10).Text(note.Diagnosis).FontSize(12);

                    if (!string.IsNullOrWhiteSpace(note.Observations))
                    {
                        col.Item().Text("Observations").FontSize(12).SemiBold();
                        col.Item().PaddingBottom(10).Text(note.Observations).FontSize(11).FontColor(Colors.Grey.Darken2);
                    }

                    // --- MEDICATIONS TABLE ---
                    col.Item().PaddingTop(10).Text("Prescribed Medications").FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);
                    col.Item().PaddingVertical(10).Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(3); c.RelativeColumn(2); c.RelativeColumn(2); c.RelativeColumn(2);
                        });

                        table.Header(h =>
                        {
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Medication").FontColor(Colors.White).SemiBold();
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Dosage").FontColor(Colors.White).SemiBold();
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Frequency").FontColor(Colors.White).SemiBold();
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Duration").FontColor(Colors.White).SemiBold();
                        });

                        foreach (var med in note.Medications)
                        {
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(med.Name);
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(med.Dosage);
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(med.Frequency);
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text($"{med.DurationInDays} Days");
                        }
                    });

                    // Follow Up
                    if (!string.IsNullOrWhiteSpace(note.FollowUpInstructions))
                    {
                        col.Item().PaddingTop(15).Background(Colors.Grey.Lighten4).Padding(10).Column(c =>
                        {
                            c.Item().Text("Instructions & Follow Up").FontSize(12).SemiBold();
                            c.Item().Text(note.FollowUpInstructions).FontSize(11).Italic();
                        });
                    }
                });

                // --- FOOTER ---
                page.Footer().PaddingTop(20).Column(col =>
                {
                    col.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
                    col.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem().Text("Medilink Hospital System").FontSize(9);
                        row.RelativeItem().AlignRight().Text(t =>
                        {
                            t.Span("Page ").FontSize(9);
                            t.CurrentPageNumber().FontSize(9);
                        });
                    });
                });
            });
        });

        return document.GeneratePdf();
    }
}