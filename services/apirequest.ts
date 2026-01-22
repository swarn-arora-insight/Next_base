"use client";
import axios from "axios";
import { applyInterceptors } from "./interceptors";
console.log("🔥 apiRequest FILE LOADED (CLIENT)");

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

applyInterceptors(apiClient);

type ApiMethod = "get" | "post" | "put" | "delete";
console.log("🔥 API CLIENT INITIALIZED with baseURL:", apiClient.defaults.baseURL);

export const apiRequest = async (
  method: ApiMethod,
  url: string,
  data?: any,
  responseType: "json" | "blob" = "json"
) => {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
      responseType,
    });

    console.log("✅ API RESPONSE", response);
    return response;
  } catch (err) {
    console.error("❌ AXIOS ERROR", err);
    throw err;
  }
};

