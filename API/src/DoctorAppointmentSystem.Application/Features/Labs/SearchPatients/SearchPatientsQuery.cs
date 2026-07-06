using DoctorAppointmentSystem.Application.Abstractions.Messaging;

namespace DoctorAppointmentSystem.Application.Features.Labs.SearchPatients;

public sealed record SearchLabPatientsQuery(string SearchTerm) 
    : IQuery<List<LabPatientSearchResponse>>;
