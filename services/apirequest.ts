import axios from "axios";
import { applyInterceptors } from "./interceptors";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/* Attach interceptors ONCE */
applyInterceptors(apiClient);

type ApiMethod = "get" | "post" | "put" | "delete";

export const apiRequest = async (
  method: ApiMethod,
  url: string,
  data?: any,
  responseType: "json" | "blob" = "json"
) => {
  const response = await apiClient.request({
    method,
    url,
    data,
    responseType,
  });

  if (responseType === "blob") {
    return {
      data: response.data,
      headers: response.headers,
    };
  }

  return response.data;
};
