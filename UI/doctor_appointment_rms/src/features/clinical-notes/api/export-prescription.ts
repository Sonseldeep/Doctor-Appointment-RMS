import axiosClient from "@/lib/axios";

export const exportPrescriptionPdf = async (appointmentId: string): Promise<Blob> => {
  const response = await axiosClient.get(
    `/api/clinical-notes/appointment/${appointmentId}/export-pdf`,
    {
      responseType: "blob", 
    }
  );
  return response.data;
};