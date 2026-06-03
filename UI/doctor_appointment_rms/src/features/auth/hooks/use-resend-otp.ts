"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";

export function useResendOtp() {
  return useMutation({
    mutationFn: authApi.resendOtp,
  });
}