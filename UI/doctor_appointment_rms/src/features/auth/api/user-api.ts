import axiosClient from "@/lib/axios";

import {
  CurrentUser,
  UploadProfilePhotoResponse,
} from "../types/auth.types";

export const userApi = {
  me: async (): Promise<CurrentUser> => {
    const res = await axiosClient.get("/users/me");
    return res.data;
  },

  uploadProfilePhoto: async (
    file: File
  ): Promise<UploadProfilePhotoResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const res = await axiosClient.post(
      "/users/me/photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },
};