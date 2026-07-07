export interface ObservationResponse {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface LabReportResponse {
  id: string;
  labName: string;
  panelName: string;
  observationDateTime: string;

  documentUrl?: string;
  documentType?: string;
  mimeType?: string;

  observations: ObservationResponse[];
}

export interface PatientSearchResult {
  id: string;
  firstName: string;       // Added
  lastName: string;        // Added
  email: string;
  dateOfBirth: string;
  profilePhotoUrl?: string | null; // Added
  phoneNumber?: string;
}