using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using ErrorOr;
using QuestPDF.Fluent;
using QuestPDF.Helpers;

namespace DoctorAppointmentSystem.Application.Features.Labs.ExportLabReport;

public class ExportLabReportQueryHandler : IQueryHandler<ExportLabReportQuery, byte[]>
{
    private readonly ILabReportRepository _labRepository;

    public ExportLabReportQueryHandler(ILabReportRepository labRepository)
    {
        _labRepository = labRepository;
    }

    public async Task<ErrorOr<byte[]>> Handle(ExportLabReportQuery request, CancellationToken cancellationToken)
    {
        
        var report = await _labRepository.GetByIdAsync(request.LabReportId, cancellationToken);

        if (report == null)
        {
            return Error.NotFound(description: "The requested medical report could not be found.");
        }

        // 2. Render out the PDF Document matching  style guidelines
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                // --- WATERMARK BACKGROUND LAYER ---
                page.Foreground().AlignCenter().AlignMiddle().Text("MEDILINK HEALTH").FontSize(54).Bold().FontColor(Colors.Grey.Lighten4);

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
                        col.Item().Text("DIAGNOSTIC REPORT").FontSize(20).Bold().FontColor(Colors.Grey.Darken3);
                        col.Item().Text($"Date: {report.ObservationDateTime:yyyy-MM-dd}").FontSize(10);
                    });
                });

                // --- CONTENT ---
                page.Content().PaddingVertical(20).Column(col =>
                {
                    // Report Metadata Summary Box
                    col.Item().Background(Colors.Grey.Lighten4).Padding(10).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("LABORATORY / FACILITY").FontSize(9).SemiBold().FontColor(Colors.Blue.Medium);
                            c.Item().Text(report.LabName).FontSize(12).Bold();
                        });
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("TEST PANEL NAME").FontSize(9).SemiBold().FontColor(Colors.Blue.Medium);
                            c.Item().Text(report.PanelName).FontSize(12).Bold();
                        });
                    });

                    // --- OBSERVATIONS / RESULTS TABLE ---
                    col.Item().PaddingTop(20).Text("Diagnostic Results & Observations").FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);

                    col.Item().PaddingVertical(10).Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(3); // Test Name
                            c.RelativeColumn(2); // Result Value
                            c.RelativeColumn(2); // Reference Range
                            c.RelativeColumn(1.5f); // Flag / Status
                        });

                        table.Header(h =>
                        {
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Test Parameter").FontColor(Colors.White).SemiBold();
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Result").FontColor(Colors.White).SemiBold();
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Ref. Range").FontColor(Colors.White).SemiBold();
                            h.Cell().Background(Colors.Blue.Medium).Padding(5).Text("Status").FontColor(Colors.White).SemiBold();
                        });

                        foreach (var obs in report.Observations)
                        {
                            // 1. Parameter Name Column
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(obs.TestName);

                            // 2. Result Value Column (with clean conditional styling)
                            var resultText = table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5)
                                .Text($"{obs.Value} {obs.Unit}");

                            if (obs.IsAbnormal)
                            {
                                resultText.FontColor(Colors.Red.Medium).Bold();
                            }
                            else
                            {
                                resultText.FontColor(Colors.Black);
                            }

                            // 3. Reference Range Column
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5)
                                .Text(obs.ReferenceRange).FontColor(Colors.Grey.Darken1);

                            // 4. Status Flag Column
                            var statusCell = table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5);
                            if (obs.IsAbnormal)
                            {
                                statusCell.Text("ABNORMAL").FontColor(Colors.Red.Medium).Bold().FontSize(10);
                            }
                            else
                            {
                                statusCell.Text("Normal").FontColor(Colors.Green.Medium).FontSize(10);
                            }
                        }
                    });

                    // Technical Note
                    col.Item().PaddingTop(15).Text("* Please correlate clinically with your attending physician.").FontSize(9).Italic().FontColor(Colors.Grey.Darken1);
                });

                // --- FOOTER ---
                page.Footer().PaddingTop(20).Column(col =>
                {
                    col.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
                    col.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem().Text("Medilink Automated Laboratory Integration System").FontSize(9);
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