using ErrorOr;
 
namespace DoctorAppointmentSystem.Domain.Labs;
 
public static class MedicalRecordErrors
{
    public static Error NotAssociatedWithPatient => Error.Forbidden(
        code: "MedicalRecord.NotAssociatedWithPatient",
        description: "You do not have access to this patient's medical records.");
}