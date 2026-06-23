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
  observations: ObservationResponse[];
}