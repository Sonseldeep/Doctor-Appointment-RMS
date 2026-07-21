import { useState } from "react";
import { exportPrescriptionPdf } from "../api/export-prescription";

export const useExportPrescription = () => {
  const [isLoading, setIsLoading] = useState(false);

  const exportPdf = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      const blob = await exportPrescriptionPdf(appointmentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Export failed:", error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  return { exportPdf, isLoading };
};