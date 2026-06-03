import axiosClient from "@/lib/axios";
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
} from "../types/auth.types";

export const authApi = {
  login: async (payload: LoginDto): Promise<AuthResponse> => {
    const res = await axiosClient.post<AuthResponse>(
      "/auth/login",
      payload
    );
    return res.data;
  },

  register: async (payload: RegisterDto): Promise<AuthResponse> => {
    const res = await axiosClient.post<AuthResponse>(
      "/auth/register",
      payload
    );
    return res.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post("/auth/logout");
  },

  verifyEmail: async (payload: { email: string; otp: string }) => {
    const res = await axiosClient.post("/auth/verify-email", payload);
    return res.data;
  },

  resendOtp: async (payload: { email: string }) => {
    const res = await axiosClient.post("/auth/resend-otp", payload);
    return res.data;
  },

  changePassword: async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await axiosClient.post(
    "/auth/change-password",
    payload
  );

  return res.data;
},

forgotPassword: async (payload: { email: string }) => {
  const res = await axiosClient.post(
    "/auth/forgot-password",
    payload
  );
  return res.data;
},

resetPassword: async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const res = await axiosClient.post(
    "/auth/reset-password",
    payload
  );
  return res.data;
},
};