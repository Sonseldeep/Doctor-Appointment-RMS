
"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";
import { tokenStorage } from "../utils/auth-storage";


export function useCurrentUser() {
 
  const hasToken = !!tokenStorage.getAccessToken();

 
  const userRole = typeof window !== "undefined" 
    ? localStorage.getItem("user_role")
    : null;

  return useQuery({
    // Unique key that includes the role to prevent cache mixing
    queryKey: ["me", userRole || "unknown"],
    
    // Call the generic me() function which routes to the correct endpoint
    queryFn: async () => {
      if (!userRole) {
        // Fallback if role is not cached - will try doctor first, then patient
        console.warn(
          "[useCurrentUser] User role not found in cache. Using fallback fetch."
        );
      }
      return userApi.me(userRole || undefined);
    },

    enabled: hasToken,
    retry: false,
    
    
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}


export function useDoctorProfile() {
  const hasToken = !!tokenStorage.getAccessToken();

  return useQuery({
    queryKey: ["me", "doctor"],
    queryFn: userApi.meDoctor,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}


export function usePatientProfile() {
  const hasToken = !!tokenStorage.getAccessToken();

  return useQuery({
    queryKey: ["me", "patient"],
    queryFn: userApi.mePatient,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}