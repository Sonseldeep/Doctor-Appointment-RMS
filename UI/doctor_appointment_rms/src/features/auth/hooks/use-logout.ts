"use client";

import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios";
import { tokenStorage } from "../utils/auth-storage";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout"); 
      // no response needed
    } catch (err) {
      // ignore errors — still logout client-side
      console.warn("Logout request failed");
    }

    // always clear client state
    tokenStorage.clear();

    router.replace("/login");
  };

  return { logout };
}