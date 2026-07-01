
// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { userApi } from "../api/user-api";
// import { tokenStorage } from "../utils/auth-storage";


// export function useCurrentUser() {
 
//   const hasToken = !!tokenStorage.getAccessToken();

 
//   const userRole = typeof window !== "undefined" 
//     ? localStorage.getItem("user_role")
//     : null;

//   return useQuery({
//     // Unique key that includes the role to prevent cache mixing
//     queryKey: ["me", userRole || "unknown"],
    
//     // Call the generic me() function which routes to the correct endpoint
//     queryFn: async () => {
//       if (!userRole) {
//         // Fallback if role is not cached - will try doctor first, then patient
//         console.warn(
//           "[useCurrentUser] User role not found in cache. Using fallback fetch."
//         );
//       }
//       return userApi.me(userRole || undefined);
//     },

//     enabled: hasToken,
//     retry: false,
    
//     staleTime:5000,
//     refetchInterval: 5000,   // Poll (refetch) every 30 seconds
//     refetchOnWindowFocus: true
//   });
// }


// export function useDoctorProfile() {
//   const hasToken = !!tokenStorage.getAccessToken();

//   return useQuery({
//     queryKey: ["me", "doctor"],
//     queryFn: userApi.meDoctor,
//     enabled: hasToken,
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });
// }


// export function usePatientProfile() {
//   const hasToken = !!tokenStorage.getAccessToken();

//   return useQuery({
//     queryKey: ["me", "patient"],
//     queryFn: userApi.mePatient,
//     enabled: hasToken,
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });
// }

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
    //  PROFESSIONAL FIX: Use a unified query key string. 
    // This allows all layouts and sidebars to share the exact same cached memory stream.
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
    
    //  THE FIX: Cache user data safely for 30 minutes. 
    // This stops it from constantly executing network updates during page swaps.
    staleTime: 1000 * 60 * 30, 
    
    //  Disable background continuous hammering loops
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
    staleTime: 1000 * 60 * 30, // 30 minutes fresh window
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
    staleTime: 1000 * 60 * 30, // 30 minutes fresh window
    refetchOnWindowFocus: false
  });
}