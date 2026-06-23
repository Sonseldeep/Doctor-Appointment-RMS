// import axiosClient from "@/lib/axios"; // Use the default export
// import { LabReportResponse } from "../types/lab-reports.types";

// export const labReportsApi = {
//   getMyReports: async (): Promise<LabReportResponse[]> => {
//     // Note: Ensure your route matches the backend Controller [Route] attribute
//     const res = await axiosClient.get<LabReportResponse[]>("/api/lab-reports");
//     return res.data;
//   },
  
//   // You can easily add more methods here later, e.g.:
//   // getReportById: async (id: string) => { ... }
// };


import axiosClient from "@/lib/axios"; 
import { LabReportResponse } from "../types/lab-reports.types";

// FIX: Changed "public interface" to "export interface"
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
}

// FIX: Changed "public const" to "export const"
export const labReportsApi = {
  getMyReports: async (): Promise<LabReportResponse[]> => {
    const res = await axiosClient.get<LabReportResponse[]>("/api/lab-reports");
    return res.data;
  },
  
  ingestLabReport: async (payload: IngestLabReportDto, accessKey: string): Promise<void> => {
    await axiosClient.post("/api/webhooks/labs/ingest", payload, {
      headers: {
        "X-Lab-Access-Key": accessKey, 
      },
    });
  }
};