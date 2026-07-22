import axiosClient from "@/lib/axios";
import { LabReportResponse, PatientSearchResult } from "../types/lab-reports.types";

export interface LabReportHistoryItem {
  labReportId: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  labName: string;
  panelName: string;
  observationDateTime: string;
  sentAtUtc: string;
  documentCount: number;
  observationCount: number;
}

export interface IngestLabReportDto {
  patientEmail: string;
  labName: string;
  panelName: string;
  observationDate: string;

  observations: {
    testName: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
  }[];

  documents?: File[]; 
}

export const labReportsApi = {
  
  getMyReports: async (): Promise<LabReportResponse[]> => {
    const res = await axiosClient.get<LabReportResponse[]>("/api/lab-reports");
    return res.data;
  },

  exportLabReportPdf: async (reportId: string): Promise<Blob> => {
    const res = await axiosClient.get(`/api/lab-reports/${reportId}/export`, {
      responseType: "blob", 
      headers: {
        "Accept": "application/pdf",
      },
    });
    return res.data;
  },

  ingestLabReport: async (payload: IngestLabReportDto): Promise<void> => {
    const formData = new FormData();

    formData.append("PatientEmail", payload.patientEmail);
    formData.append("LabName", payload.labName);
    formData.append("PanelName", payload.panelName);
    formData.append("ObservationDate", payload.observationDate);
    

    
    formData.append(
      "ObservationsJson",
      JSON.stringify(payload.observations)
    );

    if (payload.documents && payload.documents.length > 0) {
      payload.documents.forEach((file) => {
        formData.append("Documents", file); 
      });
    }

    await axiosClient.post(
      "/api/lab-technicians/lab-results/ingest",
      formData
    );
  },


  getLabHistory: async (): Promise<LabReportHistoryItem[]> => {
    const res = await axiosClient.get<LabReportHistoryItem[]>(
      "/api/lab-technicians/lab-results/history"
    );
    return res.data;
  },
  
  searchPatients: async (query: string): Promise<PatientSearchResult[]> => {
    const res = await axiosClient.get<PatientSearchResult[]>("/api/doctor/patients/search", {
      params: { q: query }, 
    });
    return res.data;
  },

  searchLabPatients: async (query: string): Promise<PatientSearchResult[]> => {
    const res = await axiosClient.get<PatientSearchResult[]>("/api/lab-technicians/patients/search", {
      params: { q: query }, 
    });
    return res.data;
  },

  getPatientLabReports: async (patientId: string): Promise<LabReportResponse[]> => {
    const res = await axiosClient.get<LabReportResponse[]>(`/api/doctor/patients/${patientId}/lab-reports`);
    return res.data;
  },

askAi: async (patientId: string, question: string): Promise<{ answer: string }> => {

  const res = await axiosClient.post(`/api/ai/patients/${patientId}/ask`, { 
    question 
  });
  return res.data;
},
};