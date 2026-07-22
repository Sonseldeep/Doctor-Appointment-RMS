"use client";

import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "../api/auth-api";
import { userApi } from "../api/user-api";
import { tokenStorage } from "../utils/auth-storage";
import { userRoleStorage } from "../utils/user-role-storage";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,

    onSuccess: async (data) => {
      try {
        if (data?.accessToken) {
          tokenStorage.setAccessToken(data.accessToken);
          document.cookie = `Access_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax;`;
        }
        const user = await userApi.me(data.role);
        queryClient.setQueryData(["auth", "current-user"], user);
        if (user && user.role) {
          userRoleStorage.setUserRole(user.role);
        }

        toast.success("Login successful");
        switch (user.role) {
          case "LabTechnician":
            router.replace("/dashboard/lab");
            break;
          case "Admin":
            router.replace("/dashboard");
            break;
          default:
            router.replace("/dashboard"); 
        }

      } catch (error) {
        console.error("Error after login:", error);
        toast.error("Login failed: Could not fetch profile");
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