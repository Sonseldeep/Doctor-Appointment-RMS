"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";
import { tokenStorage } from "../utils/auth-storage";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: userApi.me,
    enabled: !!tokenStorage.getAccessToken(), // only run if logged in
    retry: false,
  });
}