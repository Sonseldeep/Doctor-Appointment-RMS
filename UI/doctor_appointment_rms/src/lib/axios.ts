import axios from "axios";
import { env } from "./env";
import { tokenStorage } from "@/features/auth/utils/auth-storage";

const axiosClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue: any[] = [];

axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    //  FIX: Check if the 401 error is coming from your login request
    const isLoginRequest = original?.url?.includes("/auth/login") || original?.url?.endsWith("/login");

    // Added "!isLoginRequest" constraint to prevent handling bad credentials here
    if (error.response?.status === 401 && !original._retry && !isLoginRequest) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(axiosClient(original)));
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${env.API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        tokenStorage.setAccessToken(newToken);

        queue.forEach((cb) => cb());
        queue = [];

        return axiosClient(original);
      } catch (err) {
        tokenStorage.clear();
        
        // Safe check: Only hard redirect if the user isn't already on the login page
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Bad credential requests will now fall straight down here instantly
    return Promise.reject(error);
  }
);

export default axiosClient;