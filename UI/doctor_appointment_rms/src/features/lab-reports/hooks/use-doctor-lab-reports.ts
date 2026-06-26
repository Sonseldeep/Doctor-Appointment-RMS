import { useQuery } from "@tanstack/react-query";
import { labReportsApi } from "../api/lab-reports-api";
import { PatientSearchResult, LabReportResponse } from "../types/lab-reports.types";

export function useDoctorPatientSearch(query: string) {
  return useQuery<PatientSearchResult[], Error>({
    queryKey: ["doctor", "patients", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      return await labReportsApi.searchPatients(query);
    },
    enabled: query.trim().length >= 2,
  });
}

export function useDoctorPatientReports(patientId: string | null) {
  return useQuery<LabReportResponse[], Error>({
    queryKey: ["doctor", "patients", patientId, "reports"],
    queryFn: async () => {
      if (!patientId) return [];
      return await labReportsApi.getPatientLabReports(patientId);
    },
    enabled: !!patientId,
  });
}