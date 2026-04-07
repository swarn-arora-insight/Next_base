"use client";
import axios from "axios";
import { applyInterceptors } from "./interceptors";
import { clearSession, getApiToken } from "@/utils/storage";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

applyInterceptors(apiClient);

type ApiMethod = "get" | "post" | "put" | "delete";

export const apiRequest = async (
  method: ApiMethod,
  url: string,
  data?: any,
  responseType: "json" | "blob" = "json",
) => {
  try {
    const payload = url === "/users/login"
    ? data
    : {
      ...data,
      token: getApiToken()
    };
    const response = await apiClient.request({
      method,
      url,
      data: payload,
      responseType,
    });

    if (responseType === "json") {
      const { header } = response.data;

      if (header?.code !== 200) {
        toast.error(header?.message || "Something went wrong");
      }
      if (header?.code === 401) {
        toast.error("Session expired, logging out.");
        window.location.href = "/";
        clearSession();
      }
    }
    return response;
  } catch (error: any) {
    if (error?.status === 401) {
      toast.error("Session expired, logging out.");
      window.location.href = "/";
      clearSession();
    } else if (
      error.response?.status === 400 ||
      error?.status === 400 ||
      error?.data?.code === 400
    ) {
      console.log(error);
      toast.error(error.data.header.message);
    }
    throw error;
  }
};
