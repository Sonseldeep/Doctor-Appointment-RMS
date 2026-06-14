import axiosClient from "@/lib/axios";
import type { 
  CreateRatingDto, 
  DoctorRatingsResponse, 
  UpdateRatingDto 
} from "../types/ratings.types";

export const ratingsApi = {
  /**
   * Submits a rating/review for a specific medical practitioner (Patient Only)
   */
  submitDoctorRating: async (doctorUserId: string, data: CreateRatingDto): Promise<void> => {
    await axiosClient.post(`/api/ratings/doctors/${doctorUserId}`, data);
  },

  /**
   * Retrieves the comprehensive scorecard and review breakdown of a doctor
   */
  getDoctorRatings: async (doctorUserId: string): Promise<DoctorRatingsResponse> => {
    const response = await axiosClient.get<DoctorRatingsResponse>(
      `/api/ratings/doctors/${doctorUserId}`
    );
    return response.data;
  },

  /**
   * Modifies an existing appointment review by ratingId (Patient Only)
   */
  updateRating: async (ratingId: string, data: UpdateRatingDto): Promise<void> => {
    await axiosClient.put(`/api/ratings/${ratingId}`, data);
  },
};