"use client";

import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "../api/doctors-api";

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: doctorsApi.getAllDoctors,
  });
}

export function useSearchDoctors(specialization: string) {
  return useQuery({
    queryKey: ["doctors", "search", specialization],
    queryFn: () => doctorsApi.searchDoctors(specialization),
    enabled: !!specialization,
  });
}