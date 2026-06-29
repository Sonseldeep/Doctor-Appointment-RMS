using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Patients;
using ErrorOr;
using QuestPDF.Fluent;
using QuestPDF.Helpers;

namespace DoctorAppointmentSystem.Application.Features.Labs.ExportLabReport;

public class ExportLabReportQueryHandler : IQueryHandler<ExportLabReportQuery, byte[]>
{
    private readonly ILabReportRepository _labRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;

    public ExportLabReportQueryHandler(
        ILabReportRepository labRepository,
        IUserRepository userRepository,
        IPatientProfileRepository patientProfileRepository)
    {
        _labRepository = labRepository;
        _userRepository = userRepository;
        _patientProfileRepository = patientProfileRepository;
    }

    public async Task<ErrorOr<byte[]>> Handle(ExportLabReportQuery request, CancellationToken cancellationToken)
    {
        var report = await _labRepository.GetByIdAsync(request.LabReportId, cancellationToken);
        if (report is null)
        {
            return Error.NotFound(description: "The requested medical report could not be found.");
        }
        var user = await _userRepository.GetByIdAsync(report.PatientId, cancellationToken);
        if (user is null)
        {
            return Error.NotFound(description: "Patient associated with this report could not be found.");
        }
        var profile = await _patientProfileRepository.GetByUserIdAsync(report.PatientId, cancellationToken);

        string? ageDisplay = null;
        if (profile is not null && profile.DateOfBirth != default)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var age = today.Year - profile.DateOfBirth.Year;
            if (profile.DateOfBirth > today.AddYears(-age))
            {
                age--;
            }
            ageDisplay = $"{age} years";
        }

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                page.Foreground().AlignCenter().AlignMiddle()
                    .Text("MEDILINK HEALTH")
                    .FontSize(54).Bold().FontColor(Colors.Grey.Lighten4);

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

                page.Content().PaddingVertical(20).Column(col =>
                {
                    col.Item()
                        .Border(1).BorderColor(Colors.Blue.Lighten3)
                        .Background(Colors.Blue.Lighten5)
                        .Padding(12)
                        .Column(patientCol =>
                        {
                            patientCol.Item()
                                .Text("PATIENT INFORMATION")
                                .FontSize(9).SemiBold().FontColor(Colors.Blue.Medium);

                            patientCol.Item().PaddingTop(6).Row(row =>
                            {
                                row.RelativeItem().Column(c =>
                                {
                                    c.Item().Text(t =>
                                    {
                                        t.Span("Name: ").SemiBold();
                                        t.Span($"{user.FirstName} {user.LastName}");
                                    });

                                    c.Item().PaddingTop(3).Text(t =>
                                    {
                                        t.Span("Email: ").SemiBold();
                                        t.Span(user.Email);
                                    });

                                    if (profile?.PhoneNumber is not null)
                                    {
                                        c.Item().PaddingTop(3).Text(t =>
                                        {
                                            t.Span("Phone: ").SemiBold();
                                            t.Span(profile.PhoneNumber);
                                        });
                                    }
                                });

                                row.RelativeItem().Column(c =>
                                {
                                    if (ageDisplay is not null)
                                    {
                                        c.Item().Text(t =>
                                        {
                                            t.Span("Age: ").SemiBold();
                                            t.Span(ageDisplay);
                                        });
                                    }

                                    if (profile?.Sex is not null && profile.Sex != DoctorAppointmentSystem.Domain.Patients.Sex.Unknown)
                                    {
                                        c.Item().PaddingTop(3).Text(t =>
                                        {
                                            t.Span("Sex: ").SemiBold();
                                            t.Span(profile.Sex.ToString());
                                        });
                                    }

                                    if (profile?.Address is not null)
                                    {
                                        c.Item().PaddingTop(3).Text(t =>
                                        {
                                            t.Span("Address: ").SemiBold();
                                            t.Span(profile.Address);
                                        });
                                    }
                                });
                            });
                        });

                    col.Item().PaddingTop(12).Background(Colors.Grey.Lighten4).Padding(10).Row(row =>
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

                    col.Item().PaddingTop(20).Text("Diagnostic Results & Observations")
                        .FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);

                    col.Item().PaddingVertical(10).Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(3);
                            c.RelativeColumn(2);
                            c.RelativeColumn(2);
                            c.RelativeColumn(1.5f);
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
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5)
                                .Text(obs.TestName);

                            var resultText = table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5)
                                .Text($"{obs.Value} {obs.Unit}");

                            if (obs.IsAbnormal)
                            {
                                resultText.FontColor(Colors.Red.Medium).Bold();
                            }                            else
                                resultText.FontColor(Colors.Black);

                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5)
                                .Text(obs.ReferenceRange).FontColor(Colors.Grey.Darken1);

                            var statusCell = table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(5);
                            if (obs.IsAbnormal)
                            {
                                statusCell.Text("ABNORMAL").FontColor(Colors.Red.Medium).Bold().FontSize(10);
                            }                            else
                                statusCell.Text("Normal").FontColor(Colors.Green.Medium).FontSize(10);
                        }
                    });
                    
                });

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