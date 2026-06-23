namespace DoctorAppointmentSystem.Domain.Labs;

public class LabObservation
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid LabReportId { get; private set; }
    public string TestName { get; private set; } = string.Empty; // e.g., "Cholesterol, Total"
    public string Value { get; private set; } = string.Empty;    // e.g., "210"
    public string Unit { get; private set; } = string.Empty;     // e.g., "mg/dL"
    public string ReferenceRange { get; private set; } = string.Empty; // e.g., "<200 mg/dL"
    public bool IsAbnormal { get; private set; }

    private LabObservation() { }

    internal LabObservation(Guid labReportId, string testName, string value, string unit, string referenceRange, bool isAbnormal)
    {
        LabReportId = labReportId;
        TestName = testName;
        Value = value;
        Unit = unit;
        ReferenceRange = referenceRange;
        IsAbnormal = isAbnormal;
    }
}