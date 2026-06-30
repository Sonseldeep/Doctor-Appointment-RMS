import axiosClient from "@/lib/axios";
import { SystemNotification } from "../types/notifications.types";

export const notificationsApi = {
  getNotifications: async (): Promise<SystemNotification[]> => {
    const res = await axiosClient.get<SystemNotification[]>("/api/notifications");
    return res.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosClient.put(`/api/notifications/${id}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosClient.put("/api/notifications/read-all", {});
  }
};