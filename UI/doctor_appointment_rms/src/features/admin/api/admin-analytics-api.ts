import axiosClient from "@/lib/axios";
import { AdminOverviewResponse } from "../types/admin-analytics.types";

export const adminAnalyticsApi = {
  getOverview: async (trendDays: number = 10): Promise<AdminOverviewResponse> => {
    const res = await axiosClient.get<AdminOverviewResponse>(
      `/api/admin/dashboard/overview?trendDays=${trendDays}`
    );
    return res.data;
  },
};