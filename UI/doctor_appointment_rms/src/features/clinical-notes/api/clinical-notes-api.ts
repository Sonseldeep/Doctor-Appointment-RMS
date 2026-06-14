import axiosClient from "@/lib/axios";
import type { 
  ClinicalNote, 
  CreateClinicalNoteDto, 
  UpdateClinicalNoteDto 
} from "../types/clinical-notes.types";

export const clinicalNotesApi = {
  /**
   * Creates a new clinical note for an appointment (Doctor Only)
   */
  createClinicalNote: async (data: CreateClinicalNoteDto): Promise<ClinicalNote> => {
    const response = await axiosClient.post<ClinicalNote>("/api/clinical-notes", data);
    return response.data;
  },

  /**
   * Updates an existing clinical note by ID (Doctor Only)
   */
  updateClinicalNote: async (
    clinicalNoteId: string, 
    data: UpdateClinicalNoteDto
  ): Promise<ClinicalNote> => {
    const response = await axiosClient.put<ClinicalNote>(
      `/api/clinical-notes/${clinicalNoteId}`, 
      data
    );
    return response.data;
  },

  /**
   * Retrieves professional clinical notes for the authenticated session (Context-Aware)
   * Returns patient notes if authenticated as Patient, or written notes if authenticated as Doctor.
   */
  getMyClinicalNotes: async (): Promise<ClinicalNote[]> => {
    const response = await axiosClient.get<ClinicalNote[]>("/api/clinical-notes/me");
    return response.data;
  },
};