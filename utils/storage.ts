const isBrowser = typeof window !== "undefined";

export const getToken = (): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  if (!isBrowser) return;
  localStorage.setItem("token", token);
};

export const clearSession = (): void => {
  if (!isBrowser) return;
  localStorage.clear();
};
