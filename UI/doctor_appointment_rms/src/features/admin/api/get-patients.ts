import axios from "@/lib/axios"; 
import { Patient, PatientFilterParams, PaginatedResponse } from "../types";

export const getPatients = async (params: PatientFilterParams): Promise<PaginatedResponse<Patient>> => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
  );

  const response = await axios.get<PaginatedResponse<Patient>>("/api/admin/patients", {
    params: cleanedParams,
  });
  return response.data;
};