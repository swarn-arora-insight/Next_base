import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { getToken, setToken, clearSession } from "@/utils/storage";

export const applyInterceptors = (axiosInstance: AxiosInstance) => {
  /* ================= REQUEST ================= */
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();

      if (token && config.url !== "/uam/login") {
        // ✅ SAFE way for Axios v1+
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  /* ================= RESPONSE ================= */
  axiosInstance.interceptors.response.use(
    (response) => {
      const token = response.headers?.["access-token"];
      if (token) {
        setToken(token);
      }
      return response;
    },
    (error) => {
      const status = error?.response?.status;

      if (status === 401) {
        toast.error("Session expired, logging out.");
        clearSession();
        window.location.href = "/login";
      } else if (status === 400) {
        toast.error(error?.response?.data?.message);
      }

      return Promise.reject(error);
    }
  );
};
