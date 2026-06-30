namespace DoctorAppointmentSystem.Application.Features.Appointments.GetMyAppointments;

public static class GetMyAppointmentsRequestExtensions
{
    public static GetMyAppointmentsQuery ToQuery(this GetMyAppointmentsRequest request, Guid userId) =>
        new(
            UserId: userId,
            Page: request.Page,
            PageSize: request.PageSize);
}
