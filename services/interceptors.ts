
"use client";
import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { getToken, setToken, setApiToken, clearSession } from "@/utils/storage";

export const applyInterceptors = (axiosInstance: AxiosInstance) => {
  console.log("🔥 Interceptors attached");

  /* ================= REQUEST ================= */
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.url !== "/users/login") {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /* ================= RESPONSE ================= */
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("✅ RESPONSE INTERCEPTOR HIT");

      // save tokens FIRST
      const token = response.headers?.["authorization"];
      if (token) setToken(token);

      const apiToken = response?.data?.response?.apiToken;
      if (apiToken) setApiToken(apiToken);

      return response; // ⬅️ NEVER reject here
    },
    (error) => {
      const status = error?.response?.status;

      if (status === 401) {
        clearSession();
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );


};
