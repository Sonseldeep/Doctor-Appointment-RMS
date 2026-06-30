namespace DoctorAppointmentSystem.Api.Common.Request;

public class LabResultRequest
{
    public string LabName { get; set; } = string.Empty;
    public string PatientEmail { get; set; } = string.Empty;
    public string PanelName { get; set; } = string.Empty;
    public DateTime ObservationDate { get; set; }
    
    public string ObservationsJson { get; set; } = string.Empty; 

    public IFormFile? Document { get; set; }
}
