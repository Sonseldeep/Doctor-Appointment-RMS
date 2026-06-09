
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "../api/auth-api";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,

    // `variables` contains the RegisterDto passed to mutate()
    onSuccess: (_data, variables) => {
      // variables is the RegisterDto used when calling mutate(...)
      const email = (variables as { email?: string })?.email ?? "";
      toast.success("Registration successful. Please verify your email.");
      // Redirect to verification page with the email as a query param
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    },

    onError: () => {
      toast.error("Registration failed");
    },
  });
}