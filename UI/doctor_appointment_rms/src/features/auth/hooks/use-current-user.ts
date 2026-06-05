// "use client";

// import { useEffect, useState } from "react";

// import { useQuery } from "@tanstack/react-query";

// import { userApi } from "../api/user-api";
// import { tokenStorage } from "../utils/auth-storage";

// export function useCurrentUser() {
//   const [enabled, setEnabled] = useState(false);

//   useEffect(() => {
//     setEnabled(!!tokenStorage.getAccessToken());
//   }, []);

//   return useQuery({
//     queryKey: ["me"],
//     queryFn: userApi.me,
//     enabled,
//     retry: false,
//   });
// }

"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";
import { tokenStorage } from "../utils/auth-storage";

/**
 * Enhanced useCurrentUser hook that:
 * 1. Gets the user's role from the token/cache
 * 2. Calls the appropriate role-specific endpoint
 * 3. Maintains backward compatibility with existing code
 * 
 * The hook automatically detects the role and fetches from:
 * - /doctors/me for Doctor role
 * - /patients/me for Patient/User role
 */
export function useCurrentUser() {
  // Read token synchronously — no useState/useEffect delay
  const hasToken = !!tokenStorage.getAccessToken();

  // Get the cached user role if available (from a previous fetch)
  // This is stored in localStorage after first successful login
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
    
    // Stale time prevents unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Optional: More explicit hook if you want to be specific about the role
 * Use this when you know for certain the user is a doctor
 */
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

/**
 * Optional: More explicit hook if you want to be specific about the role
 * Use this when you know for certain the user is a patient
 */
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