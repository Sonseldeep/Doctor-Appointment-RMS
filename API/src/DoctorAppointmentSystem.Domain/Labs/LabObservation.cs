namespace DoctorAppointmentSystem.Domain.Labs;

public class LabObservation
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid LabReportId { get; private set; }

    public LabReport LabReport { get; private set; } = null!;
    public string TestName { get; private set; } = string.Empty;
    public string Value { get; private set; } = string.Empty;   
    public string Unit { get; private set; } = string.Empty;   
    public string ReferenceRange { get; private set; } = string.Empty; 
    public bool IsAbnormal { get; private set; }

    private LabObservation() { }

    public LabObservation(Guid labReportId, string testName, string value, string unit, string referenceRange, bool isAbnormal)
    {
        Id = Guid.NewGuid();
        LabReportId = labReportId;
        TestName = testName;
        Value = value;
        Unit = unit;
        ReferenceRange = referenceRange;
        IsAbnormal = isAbnormal;
    }
}