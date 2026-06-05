"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "../api/auth-api";
import { userRoleStorage } from "../utils/user-role-storage"; // ✅ ADD THIS
import { userApi } from "../api/user-api"; // ✅ ADD THIS

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,

    onSuccess: async () => {
      // ✅ ADD THIS BLOCK
      try {
        // Fetch user profile to get the role
        const user = await userApi.me();
        
        // Store the role in localStorage
        userRoleStorage.setUserRole(user.role);
        
        console.log("✅ Role stored:", user.role);
      } catch (error) {
        console.warn("Could not fetch user profile:", error);
        // Don't block registration if profile fetch fails
      }
      // ✅ END ADD THIS BLOCK

      toast.success("Registration successful");
      router.push("/verify-email");
    },

    onError: () => {
      toast.error("Registration failed");
    },
  });
}