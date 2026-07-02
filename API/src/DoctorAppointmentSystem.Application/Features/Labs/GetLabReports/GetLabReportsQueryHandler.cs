using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

public sealed class GetLabReportsQueryHandler : IQueryHandler<GetLabReportsQuery, List<LabReportResponse>>
{
    private readonly ILabReportRepository _labRepository;

    public GetLabReportsQueryHandler(ILabReportRepository labRepository)
    {
        _labRepository = labRepository;
    }


    public async Task<ErrorOr<List<LabReportResponse>>> Handle(
        GetLabReportsQuery request,
        CancellationToken cancellationToken)
    {
        var reports = await _labRepository.GetByPatientIdAsync(request.PatientId, cancellationToken);

        return reports.Select(r => new LabReportResponse(
            r.Id,
            r.LabName,
            r.PanelName,
            r.ObservationDateTime,
            r.DocumentUrl,   
            r.DocumentType,  
            r.MimeType,      
            r.Observations.Select(o => new ObservationResponse(
                o.TestName,
                o.Value,
                o.Unit,
                o.ReferenceRange,
                o.IsAbnormal)).ToList()
        )).ToList();
    }
}