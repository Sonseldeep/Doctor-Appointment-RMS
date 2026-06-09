namespace DoctorAppointmentSystem.Application.Features.Admin.Doctor.GetAllDoctors;

public static class GetAllDoctorsRequestExtensions
{
    public static GetAllDoctorsQuery ToQuery(this GetAllDoctorsRequest request) =>
        new(
            Page: request.Page,
            PageSize: request.PageSize,
            SearchTerm: request.SearchTerm,
            Specialization: request.Specialization,
            Status: request.Status);
}