import { z } from "zod";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema";

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