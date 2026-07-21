using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Features.Labs.Common;

namespace DoctorAppointmentSystem.Application.Features.Labs.GetLabTechnicianSendHistory;

public record GetLabTechnicianSendHistoryQuery(Guid LabTechnicianId) 
    : IQuery<List<LabTechnicianSendHistoryItemResponse>>;

