import axiosClient from "@/lib/axios";

export const userApi = {
  me: async () => {
    const res = await axiosClient.get("/users/me");
    return res.data;
  },
};