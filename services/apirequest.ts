"use client";
import axios from "axios";
import { applyInterceptors } from "./interceptors";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

applyInterceptors(apiClient);

type ApiMethod = "get" | "post" | "put" | "delete";

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

    return response;
  } catch (err) {
    throw err;
  }
};

