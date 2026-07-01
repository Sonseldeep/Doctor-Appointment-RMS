// import axiosClient from "@/lib/axios";
// import { LabReportResponse } from "../types/lab-reports.types";

// export interface IngestLabReportDto {
//   patientEmail: string;
//   labName: string;
//   panelName: string;
//   observationDate: string;

//   observations: {
//     testName: string;
//     value: string;
//     unit: string;
//     referenceRange: string;
//     isAbnormal: boolean;
//   }[];

//   document?: File | null;
// }

// export const labReportsApi = {
//   getMyReports: async (): Promise<LabReportResponse[]> => {
//     const res = await axiosClient.get<LabReportResponse[]>(
//       "/api/lab-reports"
//     );

//     return res.data;
//   },

//   exportLabReportPdf: async (reportId: string): Promise<Blob> => {
//     const res = await axiosClient.get(`/api/lab-reports/${reportId}/export`, {
//       responseType: "blob", // Tells Axios to download raw stream data
//       headers: {
//         "Accept": "application/pdf",
//       },
//     });

//     return res.data;
//   },

//   ingestLabReport: async (
//     payload: IngestLabReportDto,
//     accessKey: string
//   ): Promise<void> => {
//     const formData = new FormData();

//     formData.append("PatientEmail", payload.patientEmail);
//     formData.append("LabName", payload.labName);
//     formData.append("PanelName", payload.panelName);
//     formData.append("ObservationDate", payload.observationDate);

//     formData.append(
//       "ObservationsJson",
//       JSON.stringify(payload.observations)
//     );

//     if (payload.document) {
//       formData.append("Document", payload.document);
//     }

//     await axiosClient.post(
//       "/api/webhooks/labs/ingest",
//       formData,
//       {
//         headers: {
//           "X-Lab-Access-Key": accessKey,
//         },
//       }
//     );
//   },
// };

// import axiosClient from "@/lib/axios";
// import { LabReportResponse, PatientSearchResult } from "../types/lab-reports.types";

// export interface IngestLabReportDto {
//   patientEmail: string;
//   labName: string;
//   panelName: string;
//   observationDate: string;

//   observations: {
//     testName: string;
//     value: string;
//     unit: string;
//     referenceRange: string;
//     isAbnormal: boolean;
//   }[];

//   document?: File | null;
// }

// export const labReportsApi = {
//   // --- Existing Patient Endpoints ---
//   getMyReports: async (): Promise<LabReportResponse[]> => {
//     const res = await axiosClient.get<LabReportResponse[]>(
//       "/api/lab-reports"
//     );

//     return res.data;
//   },

//   exportLabReportPdf: async (reportId: string): Promise<Blob> => {
//     const res = await axiosClient.get(`/api/lab-reports/${reportId}/export`, {
//       responseType: "blob", // Tells Axios to download raw stream data
//       headers: {
//         "Accept": "application/pdf",
//       },
//     });

//     return res.data;
//   },

//   // --- Existing Webhook/Lab Ingestion Endpoints ---
//   ingestLabReport: async (
//     payload: IngestLabReportDto,
//     accessKey: string
//   ): Promise<void> => {
//     const formData = new FormData();

//     formData.append("PatientEmail", payload.patientEmail);
//     formData.append("LabName", payload.labName);
//     formData.append("PanelName", payload.panelName);
//     formData.append("ObservationDate", payload.observationDate);

//     formData.append(
//       "ObservationsJson",
//       JSON.stringify(payload.observations)
//     );

//     if (payload.document) {
//       formData.append("Document", payload.document);
//     }

//     await axiosClient.post(
//       "/api/webhooks/labs/ingest",
//       formData,
//       {
//         headers: {
//           "X-Lab-Access-Key": accessKey,
//         },
//       }
//     );
//   },

//   verifyAccessKey: async (accessKey: string): Promise<void> => {
//     await axiosClient.get("/api/webhooks/labs/verify-key", {
//       headers: {
//         "X-Lab-Access-Key": accessKey,
//       },
//     });
//   },

//   // --- New Doctor-Facing Endpoints ---
//   searchPatients: async (query: string): Promise<PatientSearchResult[]> => {
//     const res = await axiosClient.get<PatientSearchResult[]>(
//       "/api/doctor/patients/search",
//       {
//         // Aligned with backend controller requirement: [FromQuery] string q
//         params: { q: query }, 
//       }
//     );
//     return res.data;
//   },

//   getPatientLabReports: async (patientId: string): Promise<LabReportResponse[]> => {
//     const res = await axiosClient.get<LabReportResponse[]>(
//       `/api/doctor/patients/${patientId}/lab-reports`
//     );
//     return res.data;
//   },
// };


import axiosClient from "@/lib/axios";
import { LabReportResponse, PatientSearchResult } from "../types/lab-reports.types";

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

  document?: File | null;
}

export const labReportsApi = {
  
  getMyReports: async (): Promise<LabReportResponse[]> => {
    const res = await axiosClient.get<LabReportResponse[]>(
      "/api/lab-reports"
    );

    return res.data;
  },

  exportLabReportPdf: async (reportId: string): Promise<Blob> => {
    const res = await axiosClient.get(`/api/lab-reports/${reportId}/export`, {
      responseType: "blob", // Tells Axios to download raw stream data
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

    if (payload.document) {
      formData.append("Document", payload.document);
    }

    await axiosClient.post(
      "/api/webhooks/labs/ingest",
      formData
    );
  },

  
  searchPatients: async (query: string): Promise<PatientSearchResult[]> => {
    const res = await axiosClient.get<PatientSearchResult[]>(
      "/api/doctor/patients/search",
      {
        // Aligned with backend controller requirement: [FromQuery] string q
        params: { q: query }, 
      }
    );
    return res.data;
  },

  getPatientLabReports: async (patientId: string): Promise<LabReportResponse[]> => {
    const res = await axiosClient.get<LabReportResponse[]>(
      `/api/doctor/patients/${patientId}/lab-reports`
    );
    return res.data;
  },
};