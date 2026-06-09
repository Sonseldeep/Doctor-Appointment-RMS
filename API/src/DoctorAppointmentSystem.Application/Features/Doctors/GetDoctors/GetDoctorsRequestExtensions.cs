namespace DoctorAppointmentSystem.Application.Features.Doctors.GetDoctors;

public static class GetDoctorsRequestExtensions
{
    public static GetDoctorsQuery ToQuery(this GetDoctorsRequest request) =>
        new(
            Page: request.Page,
            PageSize: request.PageSize,
            SearchTerm: request.SearchTerm,
            Specialization: request.Specialization);
}