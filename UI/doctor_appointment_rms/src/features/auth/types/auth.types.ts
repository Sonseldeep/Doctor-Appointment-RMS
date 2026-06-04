import { z } from "zod";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema";
import { UserRole } from "./roles";
export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export interface AuthResponse {
  accessToken: string;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profilePhotoUrl: string | null;
}

export interface UploadProfilePhotoResponse {
  photoUrl: string;
}