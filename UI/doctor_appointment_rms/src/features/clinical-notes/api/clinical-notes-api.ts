import axiosClient from "@/lib/axios";
import type { 
  ClinicalNote, 
  CreateClinicalNoteDto, 
  UpdateClinicalNoteDto 
} from "../types/clinical-notes.types";

export const clinicalNotesApi = {

  createClinicalNote: async (data: CreateClinicalNoteDto): Promise<ClinicalNote> => {
    const response = await axiosClient.post<ClinicalNote>("/api/clinical-notes", data);
    return response.data;
  },


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


  getMyClinicalNotes: async (): Promise<ClinicalNote[]> => {
    const response = await axiosClient.get<ClinicalNote[]>("/api/clinical-notes/me");
    return response.data;
  },

  getUpcomingFollowUps: async (): Promise<any[]> => {
  const response = await axiosClient.get<any[]>("/api/clinical-notes/upcoming-followups");
  return response.data;
},
};