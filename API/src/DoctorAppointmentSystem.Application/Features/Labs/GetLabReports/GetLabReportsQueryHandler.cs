//using DoctorAppointmentSystem.Application.Abstractions.Labs;
//using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
//using DoctorAppointmentSystem.Application.Abstractions.Messaging;
//using ErrorOr;

//namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

//// This is correct: The interface handles the ErrorOr wrapping for you.
//public sealed class GetLabReportsQueryHandler : IQueryHandler<GetLabReportsQuery, List<LabReportResponse>>
//{
//    private readonly ILabReportRepository _labRepository;

//    public GetLabReportsQueryHandler(ILabReportRepository labRepository)
//        => _labRepository = labRepository;

//    // This is also correct: You manually return ErrorOr here.
//    public async Task<ErrorOr<List<LabReportResponse>>> Handle(
//        GetLabReportsQuery request,
//        CancellationToken cancellationToken)
//    {
//        var reports = await _labRepository.GetByPatientIdAsync(request.PatientId, cancellationToken);

//        return reports.Select(r => new LabReportResponse(
//            r.Id,
//            r.LabName,
//            r.PanelName,
//            r.ObservationDateTime,
//            r.Observations.Select(o => new ObservationResponse(
//                o.TestName,
//                o.Value,
//                o.Unit,
//                o.ReferenceRange,
//                o.IsAbnormal)).ToList()
//        )).ToList();
//    }
//}

using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabReports;

public sealed class GetLabReportsQueryHandler : IQueryHandler<GetLabReportsQuery, List<LabReportResponse>>
{
    private readonly ILabReportRepository _labRepository;

    public GetLabReportsQueryHandler(ILabReportRepository labRepository)
        => _labRepository = labRepository;

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
            r.DocumentUrl,   // Map the secure Cloudinary URL
            r.DocumentType,  // Map the category (e.g., "PDF", "XRAY")
            r.MimeType,      // Map the file MIME type (e.g., "application/pdf")
            r.Observations.Select(o => new ObservationResponse(
                o.TestName,
                o.Value,
                o.Unit,
                o.ReferenceRange,
                o.IsAbnormal)).ToList()
        )).ToList();
    }
}