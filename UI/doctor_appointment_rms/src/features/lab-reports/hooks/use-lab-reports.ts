import { useQuery } from '@tanstack/react-query';
import { labReportsApi } from '../api/lab-reports-api'; // 1. Import the object

export const useLabReports = () => {
  return useQuery({
    queryKey: ['lab-reports'],
    queryFn: labReportsApi.getMyReports, // 2. Call the method on the object

    staleTime: Infinity,          // Trust SignalR to tell us when data is stale
    refetchOnMount: "always",     // Ensure fresh validation on layout swap
    refetchOnWindowFocus: true,   // Graceful sync recovery if tab goes dark
    refetchOnReconnect: true,
  });
};