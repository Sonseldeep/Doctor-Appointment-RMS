"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authApi } from "../api/auth-api";
import { tokenStorage } from "../utils/auth-storage";
import { userRoleStorage } from "../utils/user-role-storage"; 

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return {
    logout: async () => {
      try {
        await authApi.logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clear token
        tokenStorage.clear();
        
        // Clear role
        userRoleStorage.clear();
        
        // Clear React Query cache
        queryClient.clear();

        toast.success("Logged out successfully");
        router.push("/login");
      }
    },
  };
}