import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../api/get-patients";
import { PatientFilterParams } from "../types";

export const useGetPatients = (params: PatientFilterParams) => {
  return useQuery({
    queryKey: ["admin", "patients", params],
    queryFn: () => getPatients(params),
    placeholderData: (previousData) => previousData, 
  });
};