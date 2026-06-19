import axiosClient from "@/lib/axios";

export const exportPrescriptionPdf = async (appointmentId: string): Promise<Blob> => {
  const response = await axiosClient.get(
    `/api/clinical-notes/appointment/${appointmentId}/export-pdf`,
    {
      responseType: "blob", // This is crucial for binary file downloads
    }
  );
  return response.data;
};