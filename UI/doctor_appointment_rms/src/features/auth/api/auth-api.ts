import axiosClient from "@/lib/axios";
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
} from "../types/auth.types";

export const authApi = {
  login: async (
    payload: LoginDto
  ): Promise<AuthResponse> => {
    const response = await axiosClient.post(
      "/auth/login",
      payload
    );

    return response.data;
  },

  register: async (
    payload: RegisterDto
  ): Promise<AuthResponse> => {
    const response = await axiosClient.post(
      "/auth/register",
      payload
    );

    return response.data;
  },
};