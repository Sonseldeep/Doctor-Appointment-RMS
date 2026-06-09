using DoctorAppointmentSystem.Application.Features.Admin.Patient.Contracts;

namespace DoctorAppointmentSystem.Application.Features.Admin.Patient.GetAllPatients;

public static class GetAllPatientsRequestMapper
{
    public static GetAllPatientsQuery ToQuery(this GetAllPatientsRequest request) =>
        new(
            Page: request.Page,
            PageSize: request.PageSize,
            SearchTerm: request.SearchTerm,
            Sex: request.Sex,
            MinAge: request.MinAge,
            MaxAge: request.MaxAge,
            Address: request.Address);

}
