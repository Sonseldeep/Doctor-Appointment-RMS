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
        var note = await _repository.GetWithDetailsByAppointmentIdAsync(request.AppointmentId, cancellationToken);

        if (note is null)
        {
            return Error.NotFound(description: "No medical prescription or note found for this appointment.");
        }

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

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

                page.Content().PaddingVertical(20).Column(col =>
                {
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