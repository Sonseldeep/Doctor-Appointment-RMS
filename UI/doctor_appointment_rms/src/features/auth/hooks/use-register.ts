
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "../api/auth-api";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (_data, variables) => {
      const email = (variables as { email?: string })?.email ?? "";
      toast.success("Registration successful. Please verify your email.");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    },

    onError: () => {
      toast.error("Registration failed");
    },
  });
}