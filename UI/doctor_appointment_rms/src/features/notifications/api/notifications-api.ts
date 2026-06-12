import axiosClient from "@/lib/axios";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "AppointmentBooked" | "AppointmentCancelled" | "AppointmentConfirmed";
  appointmentId: string;
  isRead: boolean;
  createdAtUtc: string;
}

export const notificationsApi = {
  getNotifications: async (): Promise<SystemNotification[]> => {
    const res = await axiosClient.get<SystemNotification[]>("/api/notifications");
    return res.data;
  },

  // 1. Added explicit empty body {} to the POST request parameter
  markAsRead: async (id: string): Promise<void> => {
    await axiosClient.put(`/api/notifications/${id}/read`, {});
  },

  // 2. Added explicit empty body {} here as well
  markAllAsRead: async (): Promise<void> => {
    await axiosClient.put("/api/notifications/read-all", {});
  }
};