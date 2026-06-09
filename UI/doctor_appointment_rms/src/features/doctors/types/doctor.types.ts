export interface Doctor {
  doctorProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
  specialization: string;
  consultationFee: number;
  bio: string;
  rating?: number;        // Optional, for display
  reviewCount?: number;   // Optional, for display
  experience?: number;    // Optional, in years
}

export interface DoctorWithDetails extends Doctor {
  displayName: string;
  fullName: string;
}