import { useMutation } from "@tanstack/react-query";
import { labReportsApi } from "../api/lab-reports-api";
import { toast } from "sonner";

export const useRagChat = (patientId: string) => {
  return useMutation({
    mutationFn: (question: string) => labReportsApi.askAi(patientId, question),
    onError: () => {
      toast.error("AI Assistant is currently unavailable. Please try again later.");
    }
  });
};