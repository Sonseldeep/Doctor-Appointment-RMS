export interface AdminDoctor {
  doctorProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
  specialization: string;
  consultationFee: number;
  bio: string;
  status: "Active" | "Suspended" | "Pending";
  createdAt: string;
  updatedAt: string;
}

export interface AdminDoctorResponse {
  data: AdminDoctor[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export type AdminActionType = "approve" | "suspend";
