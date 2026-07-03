// import { useQuery } from "@tanstack/react-query";
// import { labReportsApi } from "../api/lab-reports-api";

// export const useLabReports = () => {
//   return useQuery({
//     queryKey: ["lab-reports", "mine"],
//     queryFn: labReportsApi.getMyReports,
//     // Keeps the previous data structurally intact while refetching in the background
//     placeholderData: (previousData) => previousData,
//     // Sets standard cache stale time (e.g., 5 minutes) since medical records don't update constantly
//     staleTime: 1000 * 60 * 5,
//   });
// };