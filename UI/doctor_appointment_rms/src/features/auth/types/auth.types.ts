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
  role: string;
}


export interface DoctorProfile {
  doctorProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Doctor";
  profilePhotoUrl: string | null;
  nmcNumber?: string;
  specialization: string;
  consultationFee: number;
  status: string;
  bio: string;
}


export interface PatientProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Registered";
  profilePhotoUrl: string | null;
  sex: string;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth?: string | Date;
}


export interface AdminProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin";
  profilePhotoUrl: string | null;
}

export interface LabTechnicianProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "LabTechnician";
  profilePhotoUrl: string | null;
}

// Union type for all user types with proper discriminated union
export type CurrentUser = DoctorProfile | PatientProfile | AdminProfile | LabTechnicianProfile;

// Type guard functions for better type safety
export const isDoctorProfile = (user: CurrentUser): user is DoctorProfile => {
  return user.role === "Doctor";
};

export const isPatientProfile = (user: CurrentUser): user is PatientProfile => {
  return user.role === "Registered";
};

export const isAdminProfile = (user: CurrentUser): user is AdminProfile => {
  return user.role === "Admin";
};

export const isLabTechnicianProfile = (user: CurrentUser): user is LabTechnicianProfile => {
  return user.role === "LabTechnician";
};

export interface UploadProfilePhotoResponse {
  photoUrl: string;
}