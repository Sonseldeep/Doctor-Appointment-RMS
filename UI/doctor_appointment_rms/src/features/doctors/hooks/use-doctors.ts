"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "../api/doctors-api";
import { DoctorsResponse } from "../types/doctor.types";

interface UseDoctorsParams {
  searchTerm?: string;
  specialization?: string;
  page?: number;
  pageSize?: number;
}

export function useDoctors({ 
  searchTerm = "", 
  specialization = "", 
  page = 1, 
  pageSize = 10
}: UseDoctorsParams = {}) {
  return useQuery<DoctorsResponse>({
    queryKey: ["doctors", { searchTerm, specialization, page, pageSize }],
    queryFn: () => doctorsApi.getAllDoctors({
      SearchTerm: searchTerm || undefined,
      Specialization: specialization || undefined,
      Page: page,
      PageSize: pageSize,
    }),
  });
}

export function useSearchDoctors(specialization: string) {
  return useQuery<DoctorsResponse>({
    queryKey: ["doctors", "search", specialization],
    queryFn: () => doctorsApi.searchDoctors(specialization),
    enabled: !!specialization,
  });
}