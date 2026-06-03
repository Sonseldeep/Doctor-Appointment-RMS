"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "../api/auth-api";
import { tokenStorage } from "../utils/auth-storage";

export function useChangePassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.changePassword,

    onSuccess: () => {
      
      toast.success("Password updated successfully");

      
      tokenStorage.clear();

      
      router.push("/login");
    },

    onError: () => {
      toast.error("Failed to update password");
    },
  });
}