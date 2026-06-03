import axios from "axios";
import { env } from "./env";
import { tokenStorage } from "@/features/auth/utils/auth-storage";


const axiosClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push(() => {
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${env.API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.accessToken;

        tokenStorage.setAccessToken(newAccessToken);

        pendingQueue.forEach((callback) => callback());
        pendingQueue = [];

        return axiosClient(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;