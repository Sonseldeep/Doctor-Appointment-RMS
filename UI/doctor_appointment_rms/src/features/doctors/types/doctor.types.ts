export interface Doctor {
  doctorProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
  specialization: string;
  consultationFee: number;
  bio: string;
  rating?: number;        
  reviewCount?: number;   
  experience?: number;    
  nmcNumber?: string;     
  gender?: string;
}


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