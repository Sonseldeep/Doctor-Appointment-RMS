export interface CreateRatingDto {
  appointmentId: string;
  score: number; 
  reviewText: string;
}

export interface UpdateRatingDto {
  score: number;
  reviewText: string;
}

export interface DoctorRatingSummary {
  doctorUserId: string;
  averageRating: number;
  totalRatings: number;
}


export interface DoctorRatingItem {
  id: string;
  doctorUserId: string;
  patientUserId: string;
  stars: number;
  comment: string;
  createdAtUtc: string; 
  updatedAtUtc: string;
  
}

export interface DoctorRatingsResponse {
  summary: DoctorRatingSummary;
  ratings: DoctorRatingItem[];
}