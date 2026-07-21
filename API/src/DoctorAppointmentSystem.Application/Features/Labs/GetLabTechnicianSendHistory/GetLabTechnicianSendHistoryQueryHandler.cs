using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Labs.Common;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabTechnicianSendHistory;

public sealed class GetLabTechnicianSendHistoryQueryHandler
    : IQueryHandler<GetLabTechnicianSendHistoryQuery, List<LabTechnicianSendHistoryItemResponse>>
{
    private readonly ILabReportRepository _labRepository;

    public GetLabTechnicianSendHistoryQueryHandler(
        ILabReportRepository labRepository)
    {
        _labRepository = labRepository;
    }

    public async Task<ErrorOr<List<LabTechnicianSendHistoryItemResponse>>> Handle(
        GetLabTechnicianSendHistoryQuery request,
        CancellationToken cancellationToken)
    {
        var history = await _labRepository.GetSentHistoryByLabTechnicianIdAsync(request.LabTechnicianId, cancellationToken);

        return history.Select(item => new LabTechnicianSendHistoryItemResponse(
            item.Report.Id,
            item.Patient.Id,
            item.Patient.FirstName,
            item.Patient.LastName,
            item.Patient.Email,
            item.Report.LabName,
            item.Report.PanelName,
            item.Report.ObservationDateTime,
            item.Report.SentAtUtc,
            item.Report.Documents.Count,
            item.Report.Observations.Count))
            .ToList();
    }
}