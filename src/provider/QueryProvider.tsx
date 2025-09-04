"use client"
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProp {
  children: any;
}

export const queryClient = new QueryClient();

export function QueryProvider({ children }: QueryProviderProp) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
