import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsApi } from "../api/admin-analytics-api";

export function useAdminOverview(trendDays: number = 10) {
  return useQuery({
    queryKey: ["admin", "overview", trendDays],
    queryFn: () => adminAnalyticsApi.getOverview(trendDays),
    staleTime: 0, // Real-time data driven by SignalR triggers
    refetchOnWindowFocus: true,
  });
}