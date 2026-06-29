export interface Doctor {
  doctorProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
  specialization: string;
  consultationFee: number;
  bio: string;
  rating?: number;        // Fallback option for display
  reviewCount?: number;   // Fallback option for display
  experience?: number;    // Fallback option for display (in years)
  nmcNumber?: string;     
  gender?: string;
}

// Matches your exact backend API response structure
export interface DoctorsResponse {
  items: Doctor[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DoctorWithDetails extends Doctor {
  displayName: string;
  fullName: string;
}