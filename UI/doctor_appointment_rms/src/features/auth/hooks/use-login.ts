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
          console.log(" Token stored");
        }

        // STEP 2: Now fetch user profile (token is available)
        const user = await userApi.me(data.role);

        // STEP 3: Store the role
        if (user && (user.role === "Doctor" || user.role === "Registered")) {
          userRoleStorage.setUserRole(user.role);
        }

        console.log("Login successful. Role stored:", user.role);

        toast.success("Login successful");

        // STEP 4: Navigate to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error(" Error after login:", error);
        toast.error("Login failed: Could not fetch profile");

        // Clear token if profile fetch failed
        tokenStorage.clear();
      }
    },

    onError: (error) => {
      console.error(" Login error:", error);
      toast.error("Invalid email or password");
    },
  });
}
