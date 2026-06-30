import axiosClient from "@/lib/axios";
import { SystemNotification } from "../types/notifications.types";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
}


export const notificationsApi = {
  getNotifications: async (
      params?: GetNotificationsParams
  ): Promise<PagedResult<SystemNotification>> => {
    const res = await axiosClient.get<PagedResult<SystemNotification>>("/api/notifications", {
      params,
    });
    return res.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosClient.put(`/api/notifications/${id}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosClient.put("/api/notifications/read-all", {});
  }
};