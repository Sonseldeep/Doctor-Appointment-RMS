// export interface ObservationResponse {
//   testName: string;
//   value: string;
//   unit: string;
//   referenceRange: string;
//   isAbnormal: boolean;
// }

// export interface LabReportResponse {
//   id: string;
//   labName: string;
//   panelName: string;
//   observationDateTime: string;

//   documentUrl?: string;
//   documentType?: string;
//   mimeType?: string;

//   observations: ObservationResponse[];
// }

// export interface PatientSearchResult {
//   id: string;
//   name: String;
//   firstName: string;       
//   lastName: string;        
//   email: string;
//   dateOfBirth: string;
//   profilePhotoUrl?: string | null; 
//   phoneNumber?: string;
// }

export interface ObservationResponse {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

// Add this interface
export interface LabDocument {
  id: string;
  documentUrl: string;
  fileName: string;
  documentType: string;
  mimeType: string;
}

export interface LabReportResponse {
  id: string;
  labName: string;
  panelName: string;
  observationDateTime: string;
  observations: ObservationResponse[];
  // Change here: Flat properties removed, array added
  documents: LabDocument[]; 
}

export interface PatientSearchResult {
  id: string;
  name: String;
  firstName: string; 
  lastName: string; 
  email: string;
  dateOfBirth: string;
  profilePhotoUrl?: string | null; 
  phoneNumber?: string;
}