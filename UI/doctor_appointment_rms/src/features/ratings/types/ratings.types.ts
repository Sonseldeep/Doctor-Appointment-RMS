export interface CreateRatingDto {
  appointmentId: string;
  score: number; // e.g. 1-5 stars
  reviewText: string;
}

export interface UpdateRatingDto {
  score: number;
  reviewText: string;
}

export interface DoctorReview {
  ratingId: string;
  patientName: string;
  score: number;
  reviewText: string;
  createdAt: string; // ISO-8601 String
}

export interface DoctorRatingsResponse {
  averageRating: number;
  totalReviews: number;
  reviews: DoctorReview[];
}