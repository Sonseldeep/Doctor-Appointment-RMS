import { useQuery } from '@tanstack/react-query';
import { labReportsApi } from '../api/lab-reports-api'; // 1. Import the object

export const useLabReports = () => {
  return useQuery({
    queryKey: ['lab-reports'],
    queryFn: labReportsApi.getMyReports, // 2. Call the method on the object
  });
};