// export interface CreateRatingDto {
//   appointmentId: string;
//   score: number; // e.g. 1-5 stars
//   reviewText: string;
// }

// export interface UpdateRatingDto {
//   score: number;
//   reviewText: string;
// }

// export interface DoctorReview {
//   ratingId: string;
//   patientName: string;
//   score: number;
//   reviewText: string;
//   createdAt: string; // ISO-8601 String
// }

// export interface DoctorRatingsResponse {
//   averageRating: number;
//   totalReviews: number;
//   reviews: DoctorReview[];
// }

export interface CreateRatingDto {
  appointmentId: string;
  score: number; // e.g. 1-5 stars
  reviewText: string;
}

export interface UpdateRatingDto {
  score: number;
  reviewText: string;
}

// 1. New interface to map the "summary" block from your backend
export interface DoctorRatingSummary {
  doctorUserId: string;
  averageRating: number;
  totalRatings: number;
}

// 2. Updated interface to match individual item shapes inside the "ratings" array
export interface DoctorRatingItem {
  id: string;
  doctorUserId: string;
  patientUserId: string;
  stars: number;
  comment: string;
  createdAtUtc: string; 
  updatedAtUtc: string;
  
}

// 3. Updated main response wrapper matching your Postman keys exactly
export interface DoctorRatingsResponse {
  summary: DoctorRatingSummary;
  ratings: DoctorRatingItem[];
}