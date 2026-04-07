"use client";
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authorization", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authorization");
  }
  return null;
};

export const setApiToken = (token: string) => localStorage.setItem("apiToken", token);
export const getApiToken = () => localStorage.getItem("apiToken");
export const clearSession = () => {
  const theme = localStorage.getItem("theme");
  localStorage.clear();
  if (theme) localStorage.setItem("theme", theme);
};

