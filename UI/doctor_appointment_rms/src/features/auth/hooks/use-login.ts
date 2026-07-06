// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import { authApi } from "../api/auth-api";
// import { userApi } from "../api/user-api";
// import { tokenStorage } from "../utils/auth-storage";
// import { userRoleStorage } from "../utils/user-role-storage";

// export function useLogin() {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: authApi.login,

//     onSuccess: async (data) => {
//       try {
//         //  Store token FIRST (before any API calls)
//         if (data?.accessToken) {
//           tokenStorage.setAccessToken(data.accessToken);
          
//           // Creates an HTTP-readable cookie for your server-side middleware
//           document.cookie = `Access_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax;`;
        
//         }

//         // STEP 2: Now fetch user profile (token is available)
//         const user = await userApi.me(data.role);

//         // STEP 3: Store the role
//         if (user && (user.role === "Doctor" || user.role === "Registered")) {
//           userRoleStorage.setUserRole(user.role);
//         }

//         console.log("Login successful. Role stored:", user.role);
//         toast.success("Login successful");

//         // STEP 4: Navigate to dashboard
//         router.push("/dashboard");
//       } catch (error) {
//         console.error(" Error after login:", error);
//         toast.error("Login failed: Could not fetch profile");

//         // Clear token if profile fetch failed
//         tokenStorage.clear();
        
//         // ADDED THIS LINE: Clean up the cookie if profile fetching fails
//         document.cookie = "Access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
//       }
//     },

//     onError: (error) => {
//       console.error(" Login error:", error);
//       toast.error("Invalid email or password");
//     },
//   });
// }

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "../api/auth-api";
import { userApi } from "../api/user-api";
import { tokenStorage } from "../utils/auth-storage";
import { userRoleStorage } from "../utils/user-role-storage";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: async (data) => {
      try {
        // STEP 1: Store token FIRST (before any API calls)
        if (data?.accessToken) {
          tokenStorage.setAccessToken(data.accessToken);
          
          // Creates an HTTP-readable cookie for your server-side middleware
          document.cookie = `Access_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax;`;
        }

        // STEP 2: Now fetch user profile (token is available)
        const user = await userApi.me(data.role);

        // STEP 3: Store the role (UPDATED to support all valid roles)
        if (user && user.role) {
          userRoleStorage.setUserRole(user.role);
        }

        toast.success("Login successful");

        // STEP 4: Navigate to specific dashboard based on role (UPDATED)
        switch (user.role) {
          case "LabTechnician":
            router.push("/dashboard/lab");
            break;
          case "Admin":
            router.push("/dashboard");
            break;
          default:
            router.push("/dashboard"); 
        }

      } catch (error) {
        console.error("Error after login:", error);
        toast.error("Login failed: Could not fetch profile");

        // Clear token if profile fetch failed
        tokenStorage.clear();
        document.cookie = "Access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      }
    },

    onError: (error: any) => {
      const errorType = error?.response?.data?.Type;

      if (errorType === "Auth.AccountLocked") {
        toast.error("Account is locked");
        return;
      }

      console.error("Login error:", error);
      toast.error("Invalid email or password");
    },
  });
}