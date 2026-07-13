"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user-api";
import { tokenStorage } from "../utils/auth-storage";

export function useCurrentUser() {
  const hasToken = !!tokenStorage.getAccessToken();

  const userRole = typeof window !== "undefined" 
    ? localStorage.getItem("user_role")
    : null;

  return useQuery({
    
    queryKey: ["auth", "current-user"], 
    
    queryFn: async () => {
      if (!userRole) {
        console.warn(
          "[useCurrentUser] User role not found in cache. Using fallback fetch."
        );
      }
      return userApi.me(userRole || undefined);
    },

    enabled: hasToken,
    retry: false,
    
    
    staleTime: 1000 * 60 * 30, 
    
    
    refetchInterval: false, 
    refetchOnWindowFocus: false 
  });
}

export function useDoctorProfile() {
  const hasToken = !!tokenStorage.getAccessToken();

  return useQuery({
    queryKey: ["me", "doctor"],
    queryFn: userApi.meDoctor,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 30, 
    refetchOnWindowFocus: false
  });
}

export function usePatientProfile() {
  const hasToken = !!tokenStorage.getAccessToken();

  return useQuery({
    queryKey: ["me", "patient"],
    queryFn: userApi.mePatient,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 30, 
    refetchOnWindowFocus: false
  });
}